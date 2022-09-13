export const notify = (
  toast: any,
  message: string,
  status: 'info' | 'warning' | 'success' | 'error' | undefined,
  position:
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'
    | undefined = 'top-right'
) => {
  toast({
    title: '',
    description: message,
    status: status,
    duration: 5000,
    position: position,
    isClosable: true,
  });
};

export const getErrorMessage = (error: any) => {
  let message = '';
  if (error?.code === 4001) {
    message = `Error: ${error?.message || ''}. Code: ${error?.code || ''}`;
  } else {
    message = `Error: ${error?.error?.message || 'unknow error'}. Code: ${
      error?.error?.code || 'unknow code'
    }`;
  }
  return message;
};
