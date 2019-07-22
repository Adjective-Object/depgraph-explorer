import * as React from "react";
const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [isClosed, setIsClosed] = React.useState(initialValue);
  const toggleIsClosed = React.useCallback(() => {
    setIsClosed(!isClosed);
  }, [isClosed]);
  return [isClosed, toggleIsClosed];
};

export default useToggle;
