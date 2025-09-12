// ========== calendar-navigation.js ==========
export const CalendarNavigation = {
    navigatePrev(view, currentDate) {
        if (view === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (view === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
        }
    },
    
    navigateNext(view, currentDate) {
        if (view === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (view === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
    }
};