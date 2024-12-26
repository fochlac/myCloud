let counter = 1;

export const addActionId = store => next => action => {
    console.log('addActionId', action);
    if (!action.actionId) {
        action.actionId = counter++;
    }
    return next(action);
}
