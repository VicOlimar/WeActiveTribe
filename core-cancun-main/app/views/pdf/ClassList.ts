
export const ClassList = (
	listStudent,time,day,studio, instructors) => {

  let rowsData = '';

  listStudent.forEach(({reserved,location,userName,userEmail})=> 
    reserved ?
      rowsData = rowsData + `<tr> 
        <td style="text-align:center;">
        ${location}
            </td>
            <td style="text-align:center;">
          ${userName}
            </td>
            <td style="text-align:center;">
          ${userEmail}
            </td>
            <td style="text-align:center;">
              </td>
          </tr>
        `
        :
        rowsData = rowsData + `<tr> 
        <td style="text-align:center;">
        ${location}
          </td>
          <td style="text-align:center;">
          </td>
          <td style="text-align:center;">
          </td>
          <td style="text-align:center;">
          </td>
        </tr>
      `
      );

	return `<html>
        <head>
          <title>Lista de tus estudiantes</title>
          <style>
            ${style}
          </style>
        </head>
        <body>
          <div class="table">
            <h2 style="text-align:center;">
              Lista de alumnos
            </h2>
            <span><b>Horario:</b> ${time}</span><br>
            <span><b>Fecha:</b> ${day}</span><br>
            <span><b>Estudio:</b> ${studio}</span><br>
            <span><b>Instructores:</b> ${instructors.map(instructor => `${instructor.name}`)}</span>
            <table>
              <tr>
                <th style="text-align:center;">
                <h3>Lugar</h3>
                </th>
                <th style="text-align:center;">  
                  <h3>Nombre</h3>
                </th>
                <th style="text-align:center;">  
                  <h3>Correo</h3>
                </th>
                <th style="text-align:center;">  
                  <h3>Asistencia</h3>
                </th>
              </tr>
              ${rowsData}
            </table>
          </div>
        </body>
      </html>
    `
}

const style = `
    body {
      padding: 10px 40px;
      font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
      font-size: 12px;
      line-height: 20px;
    }

    body > h1 {
      font-size: 22px;
      line-height: 22px;
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    body > h2 {
      font-size: 18px;
      line-height: 20px;
      margin-bottom: 10px;
      font-weigth: bold;
    }
    
    body > h3 {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 5px;
      font-weigth: bold;
    }

    body > header {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      align-content: stretch;
      background-color: #000000;
      padding: 2%;
    }

    .table {
      width: 100%;
      margin-top: 20px;
      padding-bottom: 10px;
    }

    .table table {
      width: 100%;
      border: 1px solid #eee;
      border-collapse: collapse;
    }

    .table table tr th,
    .table table tr td {
      font-size: 13px;
      padding: 10px;
      border: 1px solid #eee;
      border-collapse: collapse;
    }

    .table table tfoot tr td {
      border-top: 3px solid #eee;
    }
`
