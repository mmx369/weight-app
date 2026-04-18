import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { ROUTES } from '../../routes';
import { ProfileDropdown } from '../../shared/UI';
import classes from './MainNavigation.module.css';

const MOTIVATION_PHRASES = [
  'Small daily steps lead to big results.',
  'Consistency beats intensity - keep going.',
  'Drink water first, then decide if you are still hungry.',
  'Your progress is personal. Compare only with yesterday.',
  'One healthy choice now is a win for your future self.',
  'Focus on habits, and the scale will follow.',
  'Move your body today, even if only for 15 minutes.',
  'A balanced plate today builds confidence tomorrow.',
  'Progress is not linear. Keep showing up.',
  'You are building a stronger version of yourself every day.',
  'Every walk counts.',
  'Sleep is part of fat loss too.',
  'Aim for better, not perfect.',
  'Protein at each meal helps your goals.',
  'Cravings pass; your goals stay.',
  'You do not need motivation to start, only a first step.',
  'Keep promises to yourself today.',
  'One meal never ruins progress.',
  'One workout never defines progress either.',
  'Your body listens to what you repeat.',
  'Healthy routines create lasting freedom.',
  'Show up for yourself, especially on hard days.',
  'Strength grows quietly with repetition.',
  'Hydration is a superpower in disguise.',
  'Plan your meals, protect your goals.',
  'Slow progress is still progress.',
  'Your future self will thank you for today discipline.',
  'Energy follows movement.',
  'Choose progress over excuses.',
  'The scale is data, not your identity.',
  'Build momentum with small wins.',
  'You are closer than you think.',
  'Make today count with one better choice.',
  'Trust the process and stay patient.',
  'Your habits are writing your story.',
  'Better food, better mood, better day.',
  'Keep your standards high and your stress low.',
  'Daily discipline beats occasional motivation.',
  'You can do hard things.',
  'Keep going; results are compounding.',
  'Every healthy breakfast is a fresh start.',
  'Choose food that fuels your goals.',
  'Be proud of the effort, not just outcomes.',
  'Master the basics: sleep, water, movement.',
  'One workout at a time.',
  'One day at a time.',
  'You are not starting over, you are leveling up.',
  'Momentum loves consistency.',
  'Eat with intention, not emotion.',
  'Train for life, not just for looks.',
  'Your pace is valid.',
  'Keep your eyes on the long game.',
  'Fewer extremes, more consistency.',
  'The best plan is the one you can repeat.',
  'Give your body care, not punishment.',
  'Strong habits create strong results.',
  'Progress hides in ordinary days.',
  'Keep it simple and sustainable.',
  'You deserve to feel good in your body.',
  'You are capable of lasting change.',
  'Every glass of water is a vote for your goals.',
  'Protect your sleep like a workout.',
  'Meal prep is self-respect.',
  'A short workout beats no workout.',
  'Tiny choices shape big outcomes.',
  'Choose what helps tomorrow you.',
  'Your effort today is never wasted.',
  'Keep your routine, even when motivation is low.',
  'Results come from what you do most days.',
  'Keep your promises, one day at a time.',
  'Consistent mornings build confident days.',
  'Choose whole foods more often.',
  'Replace all or nothing with always something.',
  'The goal is progress you can keep.',
  'Better decisions are built, not born.',
  'You are stronger than your cravings.',
  'Stay patient; your body is adapting.',
  'Keep showing up, especially now.',
  'Do it tired, do it busy, just do it.',
  'Discipline is self-love in action.',
  'You do not need perfect conditions to progress.',
  'Every rep, step, and choice matters.',
  'Keep the streak alive today.',
  'Make your environment support your goals.',
  'Healthy boundaries include food and time.',
  'Confidence comes from kept commitments.',
  'You are earning your transformation daily.',
  'Keep it boring, keep it effective.',
  'Success is a system, not a single day.',
  'Your best days come from consistent basics.',
  'Refocus quickly, do not restart dramatically.',
  'Keep your standards, drop the guilt.',
  'Build a body that supports your life.',
  'Courage is choosing again after setbacks.',
  'Long-term wins beat short-term comfort.',
  'You are one decision away from momentum.',
  'Train your mindset with your body.',
  'Stay kind to yourself and consistent with your plan.',
  'Daily effort turns goals into reality.',
  'Today is a great day to continue.',
];

export const MainNavigation: React.FC = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const dailyPhrase = useMemo(() => {
    const today = new Date();
    const dayKey = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
    const userKey = store.user.email || 'guest';
    const seed = `${dayKey}-${userKey}`;

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return MOTIVATION_PHRASES[hash % MOTIVATION_PHRASES.length];
  }, [store.user.email]);

  const logoutHandler = () => {
    store.logout();
    navigate('/auth');
  };

  return (
    <>
      <header className={classes.header}>
        <Link to={ROUTES.HOME} className={classes.brandLink}>
          <div className={classes.logoBadge}>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
            </svg>
          </div>
          <div className={classes.brandText}>
            <span className={classes.brandMain}>MYWeight</span>
            <span className={classes.brandSub}>Track your progress</span>
          </div>
        </Link>

        <div className={classes.rightSection}>
          {store.isAuth && (
            <Link to={ROUTES.DASHBOARD} className={classes.dashboardLink}>
              Dashboard
            </Link>
          )}

          {store.isAuth && (
            <div className={classes.welcomeText}>
              Welcome, <span>{store.user.firstName || store.user.email}</span>
            </div>
          )}

          <ProfileDropdown isAuth={store.isAuth} onLogout={logoutHandler} />
        </div>
      </header>

      {store.isAuth && (
        <div className={classes.motivationBar}>
          <span className={classes.motivationIcon}>✨</span>
          <span className={classes.motivationText}>{dailyPhrase}</span>
        </div>
      )}
    </>
  );
};
