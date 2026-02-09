import {
    differenceInYears,
    differenceInWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    isValid,
    intervalToDuration,
    isLeapYear
} from 'date-fns';

export interface AgeDetails {
    years: number;
    months: number;
    days: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    nextBirthday: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        date: Date;
        ageTurning: number;
    };
    zodiac: string;
    leapYearsLived: number;
}

export const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    return "Capricorn";
};

export const calculateLeapYearsLived = (dob: Date): number => {
    const currentYear = new Date().getFullYear();
    const birthYear = dob.getFullYear();
    let count = 0;
    for (let year = birthYear; year <= currentYear; year++) {
        if (isLeapYear(new Date(year, 1, 1))) {
            if (year === birthYear && dob > new Date(year, 1, 29)) continue;
            if (year === currentYear && new Date() < new Date(year, 1, 29)) continue;
            count++;
        }
    }
    return count;
};

export const calculateAgeDetails = (dob: Date): AgeDetails | null => {
    if (!isValid(dob)) return null;

    const now = new Date();

    // Basic age
    const years = differenceInYears(now, dob);
    // Better to use intervalToDuration for precise Y/M/D
    const duration = intervalToDuration({ start: dob, end: now });

    // Totals
    const totalWeeks = differenceInWeeks(now, dob);
    const totalDays = differenceInDays(now, dob);
    const totalHours = differenceInHours(now, dob);
    const totalMinutes = differenceInMinutes(now, dob);
    const totalSeconds = differenceInSeconds(now, dob);

    // Next Birthday
    const currentYear = now.getFullYear();
    let nextBirthdayDate = new Date(dob);
    nextBirthdayDate.setFullYear(currentYear);
    if (nextBirthdayDate < now) {
        nextBirthdayDate.setFullYear(currentYear + 1);
    }

    const nextBirthdayDuration = intervalToDuration({ start: now, end: nextBirthdayDate });
    const nextBirthdayDays = differenceInDays(nextBirthdayDate, now);

    const nextBirthday = {
        days: nextBirthdayDays,
        hours: nextBirthdayDuration.hours || 0,
        minutes: nextBirthdayDuration.minutes || 0,
        seconds: nextBirthdayDuration.seconds || 0,
        date: nextBirthdayDate,
        ageTurning: years + 1
    };

    return {
        years: duration.years || 0,
        months: duration.months || 0,
        days: duration.days || 0,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        nextBirthday,
        zodiac: getZodiacSign(dob),
        leapYearsLived: calculateLeapYearsLived(dob)
    };
};
