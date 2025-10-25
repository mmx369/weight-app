/**
 * Расчет идеального веса на основе роста, возраста и пола
 * Использует формулу Devine (1974) для расчета идеального веса
 */

export interface IdealWeightResult {
  min: number;
  max: number;
  range: string;
}

export function calculateIdealWeight(
  height: number, // в см
  age: number, // в годах
  gender: 'male' | 'female'
): IdealWeightResult | null {
  try {
    // Проверяем валидность входных данных
    if (!height || height < 100 || height > 250) return null;
    if (!age || age < 13 || age > 120) return null;
    if (!gender || !['male', 'female'].includes(gender)) return null;

    // Конвертируем рост в дюймы для формулы Devine
    const heightInches = height / 2.54;

    let idealWeight: number;

    if (gender === 'male') {
      // Формула Devine для мужчин: IBW = 50 + 2.3 * (height_inches - 60)
      idealWeight = 50 + 2.3 * (heightInches - 60);
    } else {
      // Формула Devine для женщин: IBW = 45.5 + 2.3 * (height_inches - 60)
      idealWeight = 45.5 + 2.3 * (heightInches - 60);
    }

    // Корректировка на возраст (старше 50 лет - небольшое снижение)
    if (age > 50) {
      idealWeight *= 0.95; // Снижение на 5% для людей старше 50
    }

    // Рассчитываем диапазон (±10% от идеального веса)
    const min = Math.round(idealWeight * 0.9 * 10) / 10;
    const max = Math.round(idealWeight * 1.1 * 10) / 10;

    return {
      min,
      max,
      range: `${min} - ${max} kg`,
    };
  } catch (error) {
    console.error('Error calculating ideal weight:', error);
    return null;
  }
}

/**
 * Альтернативный расчет с использованием формулы BMI
 * BMI диапазон 18.5 - 24.9 считается нормальным
 */
export function calculateIdealWeightBMI(
  height: number, // в см
  gender: 'male' | 'female'
): IdealWeightResult | null {
  try {
    if (!height || height < 100 || height > 250) return null;
    if (!gender || !['male', 'female'].includes(gender)) return null;

    // Конвертируем рост в метры
    const heightMeters = height / 100;

    // Рассчитываем вес для BMI 18.5 и 24.9
    const minWeight = 18.5 * (heightMeters * heightMeters);
    const maxWeight = 24.9 * (heightMeters * heightMeters);

    const min = Math.round(minWeight * 10) / 10;
    const max = Math.round(maxWeight * 10) / 10;

    return {
      min,
      max,
      range: `${min} - ${max} kg`,
    };
  } catch (error) {
    console.error('Error calculating ideal weight BMI:', error);
    return null;
  }
}


