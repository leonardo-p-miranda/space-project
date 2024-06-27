const { processTransaction } = require('../../controllers/pilots');

test('should process transaction successfully', async () => {
  const result = await processTransaction('1');
  expect(result).toEqual({ message: "Transaction processed successfully" });
});

test('should return error if weight not supported', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  await processTransaction('2');
  
  expect(consoleErrorSpy).toHaveBeenCalledWith('Peso não suportado, aguarde outra viagem');
  consoleErrorSpy.mockRestore();
});

