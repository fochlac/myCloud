export const UPDATE_QUEUE = 'UPDATE_QUEUE'
export function updateQueue(partial) {
  return {
    type: UPDATE_QUEUE,
    partial,
  }
}
