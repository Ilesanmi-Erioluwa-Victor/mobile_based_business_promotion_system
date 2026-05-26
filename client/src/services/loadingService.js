let count = 0;
const subscribers = new Set();

const notify = () => {
  const isLoading = count > 0;
  subscribers.forEach((cb) => cb(isLoading));
};

const show = () => {
  count += 1;
  notify();
};

const hide = () => {
  count = Math.max(0, count - 1);
  notify();
};

const subscribe = (cb) => {
  subscribers.add(cb);
  // notify initial state
  cb(count > 0);
  return () => subscribers.delete(cb);
};

export default { show, hide, subscribe };
