// services/userService.js
import mongoose from 'mongoose';
import User from '../models/User.js';

export const validateUser = (req) => {
  const userId = req.user?.id?.toString();
  if (!userId) {
    throw new Error('Invalid user ID');
  }
  return userId;
};

/**
 * Create a new user
 * @param {Object} userData - { appId, companyId, ... }
 * @returns {Promise<User>}
 */
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {String} id - User's MongoDB ObjectId
 * @returns {Promise<User|null>}
 */
export const getUserById = async (id) => {
  try {
    return await User.findById(id).exec();
  } catch (error) {
    console.error('Failed to get user by ID:', error);
    throw error;
  }
};

/**
 * Get user by App ID
 * @param {String} appId
 * @returns {Promise<User|null>}
 */
export const getUserByAppId = async (appId) => {
  try {
    return await User.findOne({ appId }).exec();
  } catch (error) {
    console.error('Failed to get user by App ID:', error);
    throw error;
  }
};

/**
 * Get users by Company ID
 * @param {String} companyId
 * @returns {Promise<Array<User>>}
 */
export const getUsersByCompanyId = async (companyId) => {
  try {
    return await User.find({ companyId }).sort({ createdAt: -1 }).exec();
  } catch (error) {
    console.error('Failed to get users by Company ID:', error);
    throw error;
  }
};

/**
 * Update a user by ID
 * @param {String} id - User's MongoDB ObjectId
 * @param {Object} updateData - Fields to update
 * @returns {Promise<User|null>}
 */
export const updateUserById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {String} id - User's MongoDB ObjectId
 * @returns {Promise<User|null>}
 */
export const deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};


/**
 * Get an existing user or create a new one based on companyId, projectId, and userId.
 * @param {Object} params - Parameters for user retrieval/creation.
 * @param {String} params.companyId - The company ID.
 * @param {String} params.projectId - The project/application ID.
 * @param {String} params.userId - The user ID (createdBy).
 * @returns {Promise<User>} - The retrieved or newly created User document.
 * @throws {Error} - Throws error if invalid IDs or database operation fails.
 */
export const getOrCreateUser = async ({ companyId, userId }) => {
  try {
    
    const createdBy = userId;

    // Attempt to find an existing user
    let user = await User.findOne({ companyId, createdBy }).exec();

    if (!user) {
      // If not found, create a new user
      user = new User({ companyId, createdBy });
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};