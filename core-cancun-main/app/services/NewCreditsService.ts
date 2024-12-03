import moment = require('moment-timezone');
import { addCourtesy } from '../libraries/util';
import { User } from '../models/User';

export class NewCreditsService {
  users = {
    //'email': [credits, 'DD/MM/YYYY'],
    'aire.cahum@hotmail.com': [2, '10/06/2022'],
    'aldbv@icloud.com': [3, '22/06/2022'],
    'alissonarellanoa@gmail.com': [7, '04/06/2022'],
    'anacamarena1421@gmail.com': [9, '25/07/2022'],
    'analidiazizaguirre@hotmail.com': [6, '02/07/2022'],
    'anapau24@yahoo.com': [14, '22/06/2022'],
    'anapaulinag.altamirano@gmail.com': [81, '16/06/2022'],
    'angelesojedar@gmail.com': [6, '30/06/2022'],
    'anyora@gmail.com': [8, '26/07/2022'],
    'camilacompean@hotmail.com': [5, '31/05/2022'],
    'carlos_ete@msn.com': [8, '23/07/2022'],
    'carolinaprovencio@gmail.com': [5, '11/07/2022'],
    'cecy.gzz81@gmail.com': [7, '09/07/2022'],
    'christineschulte04@gmail.com': [446, '14/09/2022'],
    'colorsam17@gmail.com': [5, '21/06/2022'],
    'denicia15@icloud.com': [76, '19/01/2023'],
    'estebanalopezr@gmail.com': [4, '16/07/2022'],
    'fatiiblanco2006@gmail.com': [7, '24/07/2022'],
    'fernandacallejo97@gmail.com': [1, '26/06/2022'],
    'garciasouza@outlook.com': [2, '30/05/2022'],
    'giba16@hotmail.com': [3, '17/06/2022'],
    'imagen.ces@gmail.com': [83, '11/06/2022'],
    'ingrid_edp@hotmail.com': [18, '08/09/2022'],
    'ivettedj@hotmail.com': [7, '04/07/2022'],
    'jzahoul@palaceresorts.com': [5, '31/05/2022'],
    'karendiazi@hotmail.com': [10, '24/07/2022'],
    'karenmarquezb@hotmail.com': [6, '23/06/2022'],
    'karimekick@gmail.com': [4, '12/07/2022'],
    'karlagv16@icloud.com': [8, '19/07/2022'],
    'karlaryc@hotmail.com': [5, '31/05/2022'],
    'kazpeitia30@gmail.com': [8, '10/07/2022'],
    'lindamalpica@hotmail.com': [1, '12/07/2022'],
    'lis_set972@hotmail.com': [9, '16/07/2022'],
    'lorsjg@gmail.com': [6, '29/05/2022'],
    'lucrezn@gmail.com': [8, '26/06/2022'],
    'luisa.v4@live.com.mx': [3, '04/07/2022'],
    'mache2805@yahoo.com.mx': [5, '24/06/2022'],
    'mariaanaghurtado@gmail.com': [12, '23/06/2022'],
    'mariel@ikosweb.com': [2, '03/06/2022'],
    'mgramoss@gmail.com': [6, '20/06/2022'],
    'mildred.gatica@gmail.com': [7, '16/06/2022'],
    'milton@scuderiaf.com': [197, '21/11/2022'],
    'naadyeli@gmail.com': [9, '22/07/2022'],
    'narcydaliac@gmail.com': [8, '09/06/2022'],
    'natalia.oyarzabal89@gmail.com': [8, '22/07/2022'],
    'natimarcelin@gmail.com': [6, '26/07/2022'],
    'nikole_kimmel@hotmail.com': [5, '30/08/2022'],
    'norma.cogam@gmail.com': [5, '31/05/2022'],
    'n_caraza@hotmail.com': [82, '20/06/2022'],
    'paomabe2001@hotmail.com': [5, '03/06/2022'],
    'paoverduzco.fotografia@hotmail.com': [28, '24/06/2022'],
    'paumg0508@icloud.com': [9, '28/06/2022'],
    'pintor.zaballa@gmail.com': [10, '26/07/2022'],
    'polojimenezb@gmail.com': [2, '04/06/2022'],
    'queridamiainfo@gmail.com': [9, '24/07/2022'],
    'revelescamila@outlook.com': [60, '11/06/2022'],
    'samara.manzo@gmail.com': [2, '03/06/2022'],
    'sam_yanez@hotmail.com': [5, '20/06/2022'],
    'scanamar1@gmail.com': [4, '23/06/2022'],
    'sel.xni2003@gmail.com': [78, '11/06/2022'],
    'sikaru19@gmail.com': [6, '18/07/2022'],
    'sotovmarco.arq@gmail.com': [9, '24/07/2022'],
    'umruiz@hotmail.com': [376, '30/09/2022'],
    'user2@correo.com': [1391, '17/03/2023'],
    'van.y.nay19@hotmail.com': [9, '26/07/2022'],
    'vini91@hotmail.com': [2, '09/06/2022'],
    'wzahoul@gmail.com': [9, '26/07/2022'],
    'xiomara_cesar3@hotmail.com': [78, '18/06/2022'],
    'yennydlg98@gmail.com': [74, '04/06/2022'],
    'zaida.1818@hotmail.com': [7, '21/06/2022'],
    'zoraya1980@hotmail.com': [10, '26/07/2022'],
  };

  static async call(user: User) {
    return new NewCreditsService().call(user);
  }

  async call(user: User) {
    const userCredits = this.users[user.email];
    if (userCredits) {
      const [creditsAmount, date] = userCredits;

      const expires_at = moment(date, 'DD/MM/YYYY')
        .utcOffset('-05:00')
        .toDate();

      await addCourtesy(
        user,
        creditsAmount,
        'Créditos Core',
        'courtesy',
        expires_at,
      );
    }
  }
}
