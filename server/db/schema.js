// In-memory array to function as a mock database
let complaintsDB = [];

export const getDB = () => complaintsDB;

export const initializeDB = () => {
  complaintsDB = [];
  console.log('In-memory Database initialized successfully for prototyping.');
};
