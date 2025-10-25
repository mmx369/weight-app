import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import WeightService from '../../services/WeightService';
import { IWeightData } from '../../shared/interfaces/IWeightData';
import classes from './WeightList.module.css';
import { Pagination } from '../../shared/UI/Pagination';
import { Loader } from '../../shared/components';
import { notify } from '../../shared/helper/notify';

export const WeightList: React.FC = () => {
  const { store } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingEntries, setDeletingEntries] = useState<Set<string>>(
    new Set()
  );

  const loadData = async (page: number = 1, isPagination: boolean = false) => {
    try {
      if (isPagination) {
        setIsPaginationLoading(true);
      } else {
        setIsLoading(true);
      }

      const result = await WeightService.getData(
        page,
        store.weightPagination.limit
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
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(1);
  }, [store]);

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
        store.weightPagination.limit
      );
      if (res.data && res.pagination) {
        store.setWeightData(res.data, res.pagination, res.idealWeight);
        setCurrentPage(res.pagination.page);
      } else {
        store.setWeightData(res);
      }
      notify('Weight entry deleted successfully!', 'success');
    } catch (error: any) {
      notify(error.message || 'Failed to delete weight entry', 'error');
    } finally {
      // Убираем запись из списка удаляемых
      setDeletingEntries((prev) => {
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

  const weight = store.weightData;

  const convertDate = (date: string) => {
    let theDate = new Date(Date.parse(date));
    return theDate.toLocaleString().split(',')[0];
  };

  // Не показываем лоадер при первой загрузке - он показывается на уровне HomePage
  // Показываем лоадер только при переключении страниц пагинации

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
                <span className={classes.weight}>{el.weight} kg</span>
                <span className={classes.separator}>-</span>
                <span className={classes.change}>
                  {el.change
                    ? `${el.change > 0 ? '+' : ''}${el.change.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <button
                className={`${classes.deleteButton} ${
                  deletingEntries.has(el._id) ? classes.deleting : ''
                }`}
                onClick={() => handleDeleteEntry(el._id)}
                disabled={deletingEntries.has(el._id)}
                title={
                  deletingEntries.has(el._id) ? 'Deleting...' : 'Delete entry'
                }
              >
                {deletingEntries.has(el._id) ? (
                  <LoadingSpinner />
                ) : (
                  <TrashIcon />
                )}
              </button>
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
