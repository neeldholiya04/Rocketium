const DataController = require('../src/controllers/DataController');
const DataService = require('../src/services/dataFetchStoreService');
const filter = require('../src/utils/FilterUtil');
const sort = require('../src/utils/SortUtil');

jest.mock('../src/services/dataFetchStoreService');
jest.mock('../src/utils/FilterUtil');
jest.mock('../src/utils/SortUtil');

describe('DataController', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get data without filters or sorting', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    DataService.getData.mockResolvedValue(mockData);

    await DataController.getData(req, res);

    expect(DataService.getData).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should apply filters and sorting', async () => {
    req.query = {
      filters: JSON.stringify([{ key: 'name', value: 'test' }]),
      sortBy: 'name',
      sortOrder: 'asc'
    };
    const mockData = [{ id: '1', name: 'test' }];
    DataService.getData.mockResolvedValue(mockData);
    filter.filterData.mockReturnValue(mockData);
    sort.sortData.mockReturnValue(mockData);

    await DataController.getData(req, res);

    expect(DataService.getData).toHaveBeenCalled();
    expect(filter.filterData).toHaveBeenCalledWith(mockData, [{ key: 'name', value: 'test' }]);
    expect(sort.sortData).toHaveBeenCalledWith(mockData, 'name', 'asc');
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return an error for invalid filter format', async () => {
    req.query.filters = 'invalid format';

    await DataController.getData(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ["Invalid filters format: Unexpected token 'i', \"invalid format\" is not valid JSON"] });
  });

  it('should create data', async () => {
    const newData = { id: '2', name: 'new' };
    req.body = newData;
    DataService.createData.mockResolvedValue(newData);

    await DataController.createData(req, res);

    expect(DataService.createData).toHaveBeenCalledWith(newData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newData);
  });

  it('should handle error when creating data', async () => {
    const newData = { id: '2', name: 'new' };
    req.body = newData;
    const errorMessage = 'User already exists';
    DataService.createData.mockRejectedValue(new Error(errorMessage));

    await DataController.createData(req, res);

    expect(DataService.createData).toHaveBeenCalledWith(newData);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  it('should update data', async () => {
    const id = '2';
    const updatedData = { name: 'updated' };
    req.params.id = id;
    req.body = updatedData;
    const mockData = { id: '2', name: 'updated' };
    DataService.updateData.mockResolvedValue(mockData);

    await DataController.updateData(req, res);

    expect(DataService.updateData).toHaveBeenCalledWith(id, updatedData);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should handle error when updating data', async () => {
    const id = '2';
    const updatedData = { name: 'updated' };
    req.params.id = id;
    req.body = updatedData;
    const errorMessage = 'User does not exist';
    DataService.updateData.mockRejectedValue(new Error(errorMessage));

    await DataController.updateData(req, res);

    expect(DataService.updateData).toHaveBeenCalledWith(id, updatedData);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  it('should delete data', async () => {
    const id = '2';
    req.params.id = id;

    await DataController.deleteData(req, res);

    expect(DataService.deleteData).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Successfully deleted" });
  });

  it('should handle error when deleting data', async () => {
    const id = '2';
    req.params.id = id;
    const errorMessage = 'Invalid ID';
    DataService.deleteData.mockRejectedValue(new Error(errorMessage));

    await DataController.deleteData(req, res);

    expect(DataService.deleteData).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
