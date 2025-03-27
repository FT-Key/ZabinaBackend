import moment from 'moment-timezone';

export const obtenerHoraActual = (zonaHoraria = 'America/Argentina/Buenos_Aires') => {
  return moment().tz(zonaHoraria);
};

export const ordenarTurnosPorHora = (fechaTurno) => {
  if (!fechaTurno.turnos || fechaTurno.turnos.length === 0) {
    return fechaTurno;
  }

  // Ordenar los turnos usando la hora como criterio de comparación
  fechaTurno.turnos.sort((a, b) => {
    // Convertir las horas en formato de 24h para comparar
    const horaA = parseInt(a.hora.replace(':', ''), 10);
    const horaB = parseInt(b.hora.replace(':', ''), 10);
    return horaA - horaB;
  });

  return fechaTurno;
}

const fechaTurno = {
  fecha: new Date(),
  turnos: [
    { hora: '14:00', tipoAtencion: 'Consulta de producto' },
    { hora: '09:00', tipoAtencion: 'Soporte técnico' },
    { hora: '11:00', tipoAtencion: 'Asesoría en compras' }
  ]
};

export const verificarHoraEnRango = (horaAComparar, esMayor, limiteHoras = null, zonaHoraria = 'America/Argentina/Buenos_Aires') => {
  const horaActual = moment().tz(zonaHoraria);

  // Combinar la hora con la fecha actual si el formato es solo "HH:mm"
  let horaComparada;
  if (typeof horaAComparar === 'string' && horaAComparar.match(/^\d{2}:\d{2}$/)) {
    // Concatenar la fecha actual con la hora proporcionada
    const fechaActual = moment().format('YYYY-MM-DD');
    horaComparada = moment.tz(`${fechaActual} ${horaAComparar}`, 'YYYY-MM-DD HH:mm', zonaHoraria);
  } else {
    // Si es un formato de fecha completo, simplemente convertirlo
    horaComparada = moment(horaAComparar).tz(zonaHoraria);
  }

  if (esMayor) {
    if (limiteHoras) {
      return horaComparada.isAfter(horaActual) && horaComparada.isBefore(horaActual.add(limiteHoras, 'hours'));
    } else {
      return horaComparada.isAfter(horaActual);
    }
  } else {
    if (limiteHoras) {
      return horaComparada.isBefore(horaActual) && horaComparada.isAfter(horaActual.subtract(limiteHoras, 'hours'));
    } else {
      return horaComparada.isBefore(horaActual);
    }
  }
};

export const normalizeDate = (date) => {
  const normalizedDate = moment.tz(date, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
  return normalizedDate;
};

export const obtenerFechasDeSemana = () => {
  const fechas = [];
  const timezone = 'America/Argentina/Buenos_Aires';
  const hoy = moment.tz(timezone);
  const lunes = moment.tz(timezone).startOf('isoWeek');
  const sabado = moment.tz(timezone).endOf('isoWeek').subtract(1, 'day');

  for (let i = 0; i < 6; i++) {
    const fecha = lunes.clone().add(i, 'days');
    fechas.push(fecha.toDate());
  }

  console.log('Fechas generadas:', fechas);
  return fechas;
};