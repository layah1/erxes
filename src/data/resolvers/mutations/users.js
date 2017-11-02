import { Users } from '../../../db/models';
import { sendEmail } from '../../../data/utils';

export default {
  login(root, args) {
    return Users.login(args);
  },

  async forgotPassword(root, { email }) {
    const token = await Users.forgotPassword(email);

    // send email ==============
    const { COMPANY_EMAIL_FROM, MAIN_APP_DOMAIN } = process.env;

    const link = `${MAIN_APP_DOMAIN}/reset-password?token=${token}`;

    sendEmail({
      toEmails: [email],
      fromEmail: COMPANY_EMAIL_FROM,
      title: 'Reset password',
      template: {
        name: 'base',
        data: {
          content: link,
        },
      },
    });

    return link;
  },

  resetPassword(root, args) {
    return Users.resetPassword(args);
  },

  usersAdd(root, args, { user }) {
    const { username, password, passwordConfirmation, email, role, details } = args;

    if (!user) throw new Error('Login required');

    if (password !== passwordConfirmation) {
      throw new Error('Incorrect password confirmation');
    }

    return Users.createUser({ username, password, email, role, details });
  },
};
