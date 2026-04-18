import { useContext, useState } from 'react';
import { Context } from '../..';
import WeightService from '../../services/WeightService';
import { IWeightData } from '../../shared/interfaces/IWeightData';
import classes from './WeightList.module.css';
import { Pagination } from '../../shared/UI/Pagination';
import { Loader } from '../../shared/components';
import { notify } from '../../shared/helper/notify';

export const WeightList: React.FC = () => {
  const PAGE_LIMIT = 10;
  const { store } = useContext(Context);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState('');
  const [deletingEntries, setDeletingEntries] = useState<Set<string>>(
    new Set()
  );
  const [updatingEntries, setUpdatingEntries] = useState<Set<string>>(new Set());

  const loadData = async (page: number = 1, isPagination: boolean = false) => {
    try {
      if (isPagination) {
        setIsPaginationLoading(true);
      }

      const result = await WeightService.getData(
        page,
        PAGE_LIMIT
      );

      if (result.data && result.pagination) {
        store.setWeightData(result.data, result.pagination, result.idealWeight);
        setCurrentPage(result.pagination.page);
      } else {
        // Fallback для старого формата
        store.setWeightData(result);
        setCurrentPage(1);
      }
    } catch (error: any) {
      console.error('Failed to fetch weight data:', error.message);
    } finally {
      if (isPagination) {
        setIsPaginationLoading(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page, true); // true означает, что это пагинация
  };

  const handleDeleteEntry = async (entryId: string) => {
    // Добавляем запись в список удаляемых
    setDeletingEntries((prev) => new Set(prev).add(entryId));

    try {
      await WeightService.deleteEntry(entryId);
      // После удаления загружаем текущую страницу с правильным лимитом
      const res = await WeightService.getData(
        currentPage,
        PAGE_LIMIT
      );
      if (res.data && res.pagination) {
        store.setWeightData(res.data, res.pagination, res.idealWeight);
        setCurrentPage(res.pagination.page);
      } else {
        store.setWeightData(res);
      }
      notify('Weight entry deleted successfully!', 'success');
    } catch (error: any) {
      notify(
        error?.response?.data?.message ||
          error.message ||
          'Failed to delete weight entry',
        'error'
      );
    } finally {
      // Убираем запись из списка удаляемых
      setDeletingEntries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(entryId);
        return newSet;
      });
    }
  };

  const handleEditStart = (entry: IWeightData) => {
    setEditingEntryId(entry._id);
    setEditingWeight(entry.weight.toString());
  };

  const handleEditCancel = () => {
    setEditingEntryId(null);
    setEditingWeight('');
  };

  const handleEditSave = async (entryId: string) => {
    const parsedWeight = parseFloat(editingWeight);

    if (isNaN(parsedWeight) || parsedWeight < 1 || parsedWeight > 200) {
      notify('Weight must be between 1 and 200 kg', 'error');
      return;
    }

    setUpdatingEntries((prev) => new Set(prev).add(entryId));
    try {
      await WeightService.updateEntry(entryId, parsedWeight.toString());
      const res = await WeightService.getData(currentPage, PAGE_LIMIT);
      if (res.data && res.pagination) {
        store.setWeightData(res.data, res.pagination, res.idealWeight);
      } else {
        store.setWeightData(res);
      }
      notify('Weight entry updated successfully!', 'success');
      handleEditCancel();
    } catch (error: any) {
      notify(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update weight entry',
        'error'
      );
    } finally {
      setUpdatingEntries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(entryId);
        return newSet;
      });
    }
  };

  const TrashIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={classes.trashIcon}
    >
      <polyline points='3,6 5,6 21,6'></polyline>
      <path d='m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2'></path>
      <line x1='10' y1='11' x2='10' y2='17'></line>
      <line x1='14' y1='11' x2='14' y2='17'></line>
    </svg>
  );

  const LoadingSpinner = () => (
    <div className={classes.spinner}>
      <div className={classes.spinnerCircle}></div>
    </div>
  );

  const EditIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={classes.editIcon}
    >
      <path d='M12 20h9' />
      <path d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z' />
    </svg>
  );

  const weight = store.weightData;

  const convertDate = (date: string) => {
    let theDate = new Date(Date.parse(date));
    return theDate.toLocaleString().split(',')[0];
  };

  if (weight.length === 0) {
    return (
      <div className={classes.container}>
        <div className={classes.title}>
          <span className={classes.titleText}>Weight Data</span>
        </div>
        <div className={classes.empty}>
          You haven't entered your weight yet.
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {/* Лоадер пагинации поверх контента */}
      {isPaginationLoading && (
        <div className={classes.paginationLoader}>
          <Loader size='small' />
        </div>
      )}

      <div className={classes.title}>
        <span className={classes.titleText}>Weight Data</span>
        <span className={classes.recordCount}>
          ({store.weightPagination.total} total records)
        </span>
      </div>

      <div className={classes.list}>
        {weight &&
          weight.map((el: IWeightData) => (
            <div key={el._id} className={classes.item}>
              <div className={classes.itemContent}>
                <span className={classes.date}>{convertDate(el.date)}</span>
                <span className={classes.separator}>-</span>
                {editingEntryId === el._id ? (
                  <input
                    type='number'
                    step={0.1}
                    min={1}
                    max={200}
                    value={editingWeight}
                    onChange={(e) => setEditingWeight(e.target.value)}
                    className={classes.weightInput}
                  />
                ) : (
                  <span className={classes.weight}>{el.weight} kg</span>
                )}
                <span className={classes.separator}>-</span>
                <span className={classes.change}>
                  {el.change
                    ? `${el.change > 0 ? '+' : ''}${el.change.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className={classes.actions}>
                {editingEntryId === el._id ? (
                  <>
                    <button
                      className={classes.saveButton}
                      onClick={() => handleEditSave(el._id)}
                      disabled={updatingEntries.has(el._id)}
                      title='Save'
                    >
                      {updatingEntries.has(el._id) ? <LoadingSpinner /> : 'Save'}
                    </button>
                    <button
                      className={classes.cancelButton}
                      onClick={handleEditCancel}
                      disabled={updatingEntries.has(el._id)}
                      title='Cancel'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={classes.editButton}
                      onClick={() => handleEditStart(el)}
                      title='Edit entry'
                    >
                      <EditIcon />
                    </button>
                    <button
                      className={`${classes.deleteButton} ${
                        deletingEntries.has(el._id) ? classes.deleting : ''
                      }`}
                      onClick={() => handleDeleteEntry(el._id)}
                      disabled={deletingEntries.has(el._id)}
                      title={
                        deletingEntries.has(el._id)
                          ? 'Deleting...'
                          : 'Delete entry'
                      }
                    >
                      {deletingEntries.has(el._id) ? (
                        <LoadingSpinner />
                      ) : (
                        <TrashIcon />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={store.weightPagination.pages}
        hasNext={store.weightPagination.hasNext}
        hasPrev={store.weightPagination.hasPrev}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
