const axios = require('axios');
const fs = require('fs');
const path = require('path');
const removeDuplicates = require('../utils/RemoveDuplicateUtil');

class DataService {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data/data.json');
    }

    async fetchDataAndStore() {
        try {
            const response = await axios.get(process.env.DATA_URL);
            const uniqueData = removeDuplicates(response.data, 'id');
            await fs.writeFileSync(this.dataPath, JSON.stringify(uniqueData, null, 2));
            console.log('Data fetched and stored successfully');
        } catch (error) {
            console.log('Error while fetching data: ', error);
            throw error;
        }
    }

    async getData() {
        try {
            const data = await fs.readFileSync(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error while reading data: ', error);
            throw error;
        }
    }

    async createData(newData) {
        try {
            const data = await this.getData();
            const existingData = data.find(item => item.id === newData.id);
            if (existingData) {
                throw new Error('User already exists');
            }
            data.push(newData);
            await fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
            return newData;
        } catch (error) {
            console.log('Error while creating data: ', error);
            throw error;
        }
    }

    async updateData(id, updatedData) {
        try {
            const data = await this.getData();
            const index = data.findIndex(item => item.id === id);
            if (index === -1) {
                throw new Error('User does not exist');
            }
            data[index] = { ...data[index], ...updatedData };
            await fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
            return data[index];
        } catch (error) {
            console.log('Error while updating data: ', error);
            throw error;
        }
    }

    async deleteData(id) {
        try {
            const data = await this.getData();
            const index = data.findIndex(item => item.id === id);
            if (index === -1) {
                throw new Error('Invalid ID');
            }
            data.splice(index, 1);
            await fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.log('Error while deleting data: ', error);
            throw error;
        }
    }
}

module.exports = new DataService();