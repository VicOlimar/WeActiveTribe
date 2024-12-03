
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Instructor', [
      // WE RIDE
      {
        name: 'MAR',
        description: 
        '<h2>"Tu mente es tu único limite"</h2>' + 
        '<p>Remix Queen. Experta en encontrar los mejores remixes y mashups. En su clase te sentirás lleno de energía, con ganas de bailar y adrenalina al tope.</p>',
      },
      {
        name: 'GERA',
        description: 
        '<h2>"Cree en ti y todo será posible"</h2>' + 
        '<p>Fan de la música Electro House. Su movimiento favorito en la bici son los tap backs. Ensu clase encontrarás un boost de energía para tu día.</p>',
      },
      {
        name: 'GEO',
        description:
        '<h2>"No te detengas hasta que te sientas orgullos@"</h2>' + 
        '<p>El objetivo de Geo es que te diviertas dando tu 100% a la vez. Su música favorita es el género House, aunque en sus clases podrás encontrar un poco de todo.</p>',
      },
      {
        name: 'VALE',
        description:
        '<h2>"Si tienes el coraje de intentarlo, tienes la capacidad para lograrlo"</h2>' + 
        '<p>Fan de Coldplay y One Republic. Sus clases están llenas de energía y buena vibra por lo que podrás divertirte, disfrutar y superar tus límites.</p>',
      },
      {
        name: 'CARO V',
        description:
        '<h2>"Cuando sientas que vas a rendirte, recuerda por qué empezaste"</h2>' + 
        '<p>Su artista favorito es Rhye. En sus rides encontrarás una clase llena de motivación y unespacio del día para dedicarlo exclusivamente para ti. Cada segundo será un reto para dar lo mejor.</p>',
      },
      {
        name: 'MARIEL',
        description:
        '<h2>"Lleva tu cuerpo al límite y sorpréndete de lo que eres capaz"</h2>' + 
        '<p>Pedalea al ritmo del reggaeton, rock, pop y electrónica. Mariel hará todo lo que esté en sus manos para ayudarte a desconectarte del exterior y conectarte con tu mente cuerpoy espíritu para sacar lo mejor de ti.</p>',
      },
      {
        name: 'NATS',
        description:
        '<h2>"Donde quiera que vayas, ahí estás"</h2>' + 
        '<p>En sus clases no hay excusas. El objetivo de Nats es llevarte al límite para que sientas que esos 45 minutos valieron la pena. Algunos de sus artistas favoritos son Avicii y Kygo.</p>',
      },
      {
        name: 'YUNI',
        description:
        '<h2>"Esfuerzate siempre al máximo, en especial cuando tengas todo en contra"</h2>' + 
        '<p>Yuni es fan de la música explosiva y que te haga mover el cuerpo. Su movimiento favorito en la bici es el COMBO. Con sus clases podrás sacar tu máximo potencial.</p>',
      },
      {
        name: 'CARO',
        description:
        '<h2>"Solo puedes crecer y avanzar si estás dispuesto a sentirte incómodo"</h2>' + 
        '<p>Caro es experta en enfrentarte a tu zona de confort y ayudarte a salir de ella. A través de su estilo de música te guiará para dar tu 100% durante la clase. Su movimiento favorito son los aplausos.</p>',
      },
      {
        name: 'MARIANA',
        description:
        '<h2>"Esfuerzate siempre al máximo, en especial cuando tengas todo en contra"</h2>' + 
        '<p>Yuni es fan de la música explosiva y que te haga mover el cuerpo. Su movimiento favorito en la bici es el COMBO. Con sus clases podrás sacar tu máximo potencial.</p>',
      },
      {
        name: 'RENATA',
        description:
        '<h2>"Solo puedes crecer y avanzar si estás dispuesto a sentirte incómodo"</h2>' + 
        '<p>Caro es experta en enfrentarte a tu zona de confort y ayudarte a salir de ella. A través de su estilo de música te guiará para dar tu 100% durante la clase. Su movimiento favorito son los aplausos.</p>',
      },
      // WE HIIT
      {
        name: 'LORE',
        description:
        '<h2>"Si fuera fácil cualquiera lo haría"</h2>' + 
        '<p>A Lore le gustan varios estilos de música. Pero entre los que más le atraen, están el pop, deep house y reggaetón. Fan de los jumping squats. ¡Espera una clase divertida!</p>',
      },
      {
        name: 'FER',
        description:
        '<h2>"You dont get what you wish for. You get what you work for."</h2>' + 
        '<p>Con Fer podrás experimentar una clase intensa llena de energía y buena vibra donde te olvides un rato de todo y trabajes por ti…. Let’s do this!</p>',
      },
      {
        name: 'RODO',
        description:
        '<h2>"Try and fail, but never fail to try."</h2>' + 
        '<p>Coach Rodo te hará sudar al beat de Beyonce. En sus clases su actitud te llevará a entregarlo todo y salir sabiendo que diste el 100%. ¡Prepárate para hacer muchos thrusters!</p>',
      },
      {
        name: 'CRIS',
        description:
        '<h2>"Te puedes arrepentir de muchas cosas, pero nunca de un workout."</h2>' + 
        '<p>Explota tus límites en una clase divertida con coach Cris. Prepárate para escuchar un poco de electrónica, pop y reggaetón.</p>',
      },
      {
        name: 'MÓNICA',
        description:
        '<h2>"Progress not perfection"</h2>' + 
        '<p>En su clase lo único que necesitas es confiar en ti mismo para explotar tus límites. Espera muchos jumping squats al ritmo de reggaeton.</p>',
      },
      {
        name: 'URIBE',
        description:
        '<h2>"Todo lo imposible es aquello que no intentas"</h2>' + 
        '<p>Le encanta la música pop-rock, así que espera escucharla en sus clases para empujarte a dar más. 50 minutos rudos, con un toque de cotorreo para disfrutar.</p>',
      },
      {
        name: 'LORETTA',
        description:
        '<h2>"Strong is the new skinny"</h2>' + 
        '<p>Buena música, diversión, sufrimiento y... BURPEES!! pero sobre todo un trabajo completo es lo que puedes esperar de la clase de coach Loretta.</p>',
      },
      {
        name: 'ADRIAN',
        description:
        '<h2>"Se la mejor versión de ti"</h2>' +
        '<p>Prepárate para darlo todo con su música rock, lleva tu cuerpo a una mejor versión de ti, mejorando tus capacidades físicas alternando los movimientos para llevarte a un desarrollo constante.</p>'
      },
      {
        name: 'ZIZI',
        description:
        '<h2>"Great things came never from comfort zones"</h2>' +
        '<p>Espera una clase divertida y llena de buena energía. Con Zizi podrás salir de tu zona de confort y encontrarás la motivación que estas buscando.</p>'
      },
      {
        name: 'CLAU',
        description:
        '<h2>"No siempre estarás motivado, tienes que aprender a ser disciplinado"</h2>' +
        '<p>Con un estilo de música variado Clau te hará trabajar duro, mejorar tu rendimiento y condición. Espera en su clase muchos box jumps + burpee!!</p>'
      },
      {
        name: 'JIME',
        description:
        '<h2>"It´s the will, not the skill"</h2>' +
        '<p>Con Jime tendrás una clase llena de la mejor energía y la música que necesitas para dar siempre tu 1000%. Buscando siempre ser auténtica y motivar a quien sea que esté en el salón.</p>'
      },
      {
        name: 'ROB',
        description:
        '<h2>"Nunca es tarde para comenzar de cero"</h2>' +
        '<p>Una clase intensa y divertida con movimientos y combinaciones que te retarán física y mentalmente. En sus clases vas a entrenar al ritmo de los 80´s y rock covers.</p>'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Instructor', null, {});
  },
};
