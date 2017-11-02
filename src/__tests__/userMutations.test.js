/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import { Users } from '../db/models';
import usersMutations from '../data/resolvers/mutations/users';

describe('User mutations', () => {
  const user = { _id: 'DFAFDFDFD' };

  test('Login', async () => {
    Users.login = jest.fn();

    const doc = { email: 'test@erxes.io', password: 'password' };

    await usersMutations.login({}, doc);

    expect(Users.login).toBeCalledWith(doc);
  });

  test('Forgot password', async () => {
    Users.forgotPassword = jest.fn();

    const doc = { email: 'test@erxes.io' };

    await usersMutations.forgotPassword({}, doc);

    expect(Users.forgotPassword).toBeCalledWith(doc.email);
  });

  test('Reset password', async () => {
    Users.resetPassword = jest.fn();

    const doc = { token: '2424920429402', newPassword: 'newPassword' };

    await usersMutations.resetPassword({}, doc);

    expect(Users.resetPassword).toBeCalledWith(doc);
  });

  test('Login required checks', async () => {
    const checkLogin = async (fn, args) => {
      try {
        await fn({}, args, {});
      } catch (e) {
        expect(e.message).toEqual('Login required');
      }
    };

    expect.assertions(1);

    // users add
    checkLogin(usersMutations.usersAdd, {});
  });

  test('Users add: wrong password confirmation', async () => {
    expect.assertions(1);

    const doc = {
      password: 'password',
      passwordConfirmation: 'wrong',
    };

    try {
      await usersMutations.usersAdd({}, doc, { user });
    } catch (e) {
      expect(e.message).toBe('Incorrect password confirmation');
    }
  });

  test('Users add', async () => {
    const user = { _id: 'DFAFDFDFD' };

    Users.createUser = jest.fn();

    const doc = {
      username: 'username',
      password: 'password',
      email: 'info@erxes.io',
      role: 'admin',
      details: {},
    };

    await usersMutations.usersAdd({}, { ...doc, passwordConfirmation: 'password' }, { user });

    expect(Users.createUser).toBeCalledWith(doc);
  });
});
