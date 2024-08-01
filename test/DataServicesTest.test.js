const fs = require('fs');
const axios = require('axios');
const DataService = require('../src/services/dataFetchStoreService');
const removeDuplicates = require('../src/utils/RemoveDuplicateUtil');

jest.mock('fs');
jest.mock('axios');
jest.mock('../src/utils/RemoveDuplicateUtil');

describe('DataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data and store it', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    axios.get.mockResolvedValue({ data: mockData });
    removeDuplicates.mockReturnValue(mockData);
    fs.writeFileSync.mockResolvedValue();

    await DataService.fetchDataAndStore();

    expect(axios.get).toHaveBeenCalledWith(process.env.DATA_URL);
    expect(removeDuplicates).toHaveBeenCalledWith(mockData, 'id');
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify(mockData, null, 2));
  });

  it('should read data', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

    const data = await DataService.getData();

    expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    expect(data).toEqual(mockData);
  });

  it('should create data', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    const newData = { id: '2', name: 'new' };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    fs.writeFileSync.mockResolvedValue();

    await DataService.createData(newData);

    mockData.push(newData);
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify(mockData, null, 2));
  });

  it('should update data', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    const updatedData = { name: 'updated' };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    fs.writeFileSync = jest.fn(); 
    
    const result = await DataService.updateData('1', updatedData);

    expect(result).toEqual({ id: '1', name: 'updated' });
    mockData[0] = { id: '1', name: 'updated' }; // Update the mock data
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify(mockData, null, 2));
});


  it('should delete data', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    fs.writeFileSync.mockResolvedValue();

    await DataService.deleteData('1');

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([], null, 2));
  });
});
