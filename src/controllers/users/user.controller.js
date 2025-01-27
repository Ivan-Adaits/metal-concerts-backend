import User from '../../models/user.model.js';
import Concert from '../../models/concerts.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';
export const profileUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteConcerts', 'title date location band').populate('subscribedBands', 'bandName genre image');
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 'Your profile has been successfully loaded', {
      id: user._id,
      username: user.username,
      email: user.email,
      favoriteConcerts: user.favoriteConcerts,
      subscribedBands: user.subscribedBands,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const addFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const concert = await Concert.findById(req.params.concertId);
    if (!user) return errorResponse(res, 404, 'User not found');
    if (!concert) return errorResponse(res, 404, 'User not found');
    if (user.favoriteConcerts.includes(concert._id)) {
      return errorResponse(res, 409, 'Concert is already in favorites');
    }
    user.favoriteConcerts.push(concert._id);
    await user.save();
    return successResponse(res, 'Concert added to favorites', {
      favoriteConcerts: user.favoriteConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const removeFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');

    user.favoriteConcerts = user.favoriteConcerts.filter(concertId => concertId.toString() !== req.params.concertId);
    await user.save();

    return successResponse(res, 'Concert remove from favorites', {
      favoriteConcerts: user.favoriteConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getFavoriteConcerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteConcerts');
    if (!user) return errorResponse(res, 404, 'User not found');

    return successResponse(res, 'List concerts successfully', {
      favoriteConcerts: user.favoriteConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
