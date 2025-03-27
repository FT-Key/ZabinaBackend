import FechaTurnoModel from "../models/fechaTurnos.schema.js";
import { normalizeDate, obtenerFechasDeSemana, verificarHoraEnRango, ordenarTurnosPorHora } from "../utils/date.utils.js";
import { HORAS_TURNOS } from '../mocks/turnos.mock.js';
import moment from 'moment-timezone';

export const obtenerTurnosService = async (pagination = null, filters = {}, user) => {
  try {
    const query = { ...filters };

    if (query.fecha) {
      query.fecha = normalizeDate(query.fecha);
    }

    const totalTurnos = await FechaTurnoModel.countDocuments(query);

    let fechasTurno;
    if (pagination) {
      const { skip, limit } = pagination;
      fechasTurno = await FechaTurnoModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'turnos.usuario',
          select: 'nombre email',
        });
    } else {
      fechasTurno = await FechaTurnoModel.find(query).populate({
        path: 'turnos.usuario',
        select: 'nombre email',
      });
    }

    await actualizarTurnosNoAsistidos(fechasTurno);

    if (user.rol !== 'admin') {
      fechasTurno.forEach(fechaTurno => {
        const turnoExistente = fechaTurno.turnos.find(turno =>
          turno.usuario?._id.toString() === user._id.toString() &&
          (turno.estado === 'pendiente' || turno.estado === 'confirmado' || turno.estado === 'libre')
        );

        if (turnoExistente) {
          throw new Error('Ya tienes un turno reservado para este día.');
        }
      });
    }

    return {
      fechaTurnos: fechasTurno,
      totalTurnos,
      statusCode: 200,
    };
  } catch (error) {
    throw new Error(error.message || 'Error al obtener los turnos');
  }
};

export const obtenerTurnoService = async (fecha, user) => {
  try {
    const fechaNormalizada = normalizeDate(fecha);

    const fechaTurno = await FechaTurnoModel.findOne({ fecha: fechaNormalizada })
      .populate('creador', 'nombre')
      .populate({
        path: 'turnos',
        populate: {
          path: 'usuario',
          select: 'nombre email'
        }
      });

    if (!fechaTurno) return null;

    await actualizarTurnosNoAsistidos([fechaTurno]);

    const turnoExistente = fechaTurno.turnos.find(turno =>
      turno.usuario?.toString() === user._id &&
      (turno.estado === 'pendiente' || turno.estado === 'confirmado' || turno.estado === 'libre')
    );

    if (turnoExistente && user.rol != 'admin') {
      throw new Error('Ya tienes un turno reservado para este día.');
    }

    return fechaTurno;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener los turnos');
  }
};

export const listaTurnosService = async (userId) => {
  try {
    const fechasTurnos = await FechaTurnoModel.find({
      'turnos.usuario': userId
    })
      .populate({
        path: 'turnos',
        populate: {
          path: 'usuario',
          select: 'nombre email'
        }
      });

    const turnos = fechasTurnos.flatMap(fechaTurno =>
      fechaTurno.turnos
        .filter(turno => turno.usuario && turno.usuario._id.toString() === userId.toString())
        .map(turno => ({
          ...turno.toObject(),
          fecha: fechaTurno.fecha
        }))
    );

    return turnos;
  } catch (error) {
    console.error('Error en listaTurnosService:', error);
    throw new Error('Error al obtener los turnos del usuario');
  }
};

export const crearTurnosParaFecha = async (fecha, creadorId) => {
  const timezone = 'America/Argentina/Buenos_Aires';
  const ahora = moment.tz(timezone);
  const fechaActual = moment.tz(fecha, timezone);

  const turnosFiltrados = HORAS_TURNOS.filter(horaTurno => {
    const turnoMoment = moment.tz(`${fechaActual.format('YYYY-MM-DD')} ${horaTurno}`, 'YYYY-MM-DD HH:mm', timezone);

    if (fechaActual.isSame(ahora, 'day')) {
      const diferenciaMinutos = turnoMoment.diff(ahora, 'minutes');
      return diferenciaMinutos >= 30;
    }
    return true;
  }).map(hora => ({
    hora,
    tipoAtencion: 'Consulta de producto',
  }));

  if (turnosFiltrados.length > 0) {
    const nuevaFechaTurno = new FechaTurnoModel({
      fecha: fechaActual.toDate(),
      creador: creadorId,
      turnos: turnosFiltrados
    });

    try {
      await nuevaFechaTurno.save();
      console.log('Turnos creados para la fecha:', fecha);
    } catch (error) {
      console.error('Error al crear los turnos para la fecha:', error);
      throw new Error('Error al crear los turnos');
    }
  } else {
    console.log(`No se generaron turnos para la fecha: ${fecha} debido a las restricciones de tiempo.`);
  }
};

export const crearTurnosSemanalesService = async (creadorId) => {
  try {
    // Generar las fechas de lunes a sábado de la semana actual (excluyendo domingo)
    const fechasSemana = obtenerFechasDeSemana();
    console.log("FECHAS: ", fechasSemana);

    for (const fecha of fechasSemana) {
      try {
        console.log("Se crea turno para: ", fecha);
        await crearTurnosParaFecha(fecha, creadorId);
      } catch (error) {
        // Manejar el error de duplicidad de clave única (turnos ya existentes para la fecha)
        if (error.message.includes('E11000')) {
          console.log(`Ya existen turnos para la fecha: ${fecha}, se omite la creación de turnos.`);
        } else {
          console.error(`Error al crear turnos para la fecha ${fecha}:`, error);
          throw error;
        }
      }
    }

    console.log('Turnos semanales creados exitosamente');
  } catch (error) {
    console.error('Error en la creación de turnos semanales:', error);
    throw new Error('Error en la creación de turnos semanales');
  }
};

export const solicitarTurnoService = async (fecha, hora, usuarioId, tipoAtencion, descripcion) => {
  const timezone = 'America/Argentina/Buenos_Aires';
  try {
    const fechaNormalizada = normalizeDate(moment.tz(fecha, timezone).format('YYYY-MM-DD'));

    const fechaTurno = await FechaTurnoModel.findOne({ fecha: fechaNormalizada });

    if (!fechaTurno) {
      throw new Error('No se encontró la fecha especificada.');
    }

    const yaPoseeTurno = fechaTurno.turnos.some(turno => turno.usuario?.equals(usuarioId) && turno.estado != 'cancelado');

    if (yaPoseeTurno) {
      return { error: 'Ya tienes un turno reservado para esta fecha.' };
    }

    const turno = fechaTurno.turnos.find(t => t.hora === hora);

    if (!turno) {
      throw new Error('No se encontró el turno especificado.');
    }

    if (!['libre'].includes(turno.estado)) {
      return null;
    }

    turno.usuario = usuarioId;
    turno.tipoAtencion = tipoAtencion;
    turno.descripcion = descripcion || '';
    turno.estado = 'pendiente';

    await fechaTurno.save();

    return turno;
  } catch (error) {
    console.error('Error en solicitarTurnoService:', error);
    throw new Error('Error al solicitar el turno');
  }
};

export const cancelarTurnoService = async (turnoId, user) => {
  try {
    let turnoCancelado;

    if (user.rol === 'cliente') {
      turnoCancelado = await FechaTurnoModel.findOneAndUpdate(
        { 'turnos._id': turnoId, 'turnos.usuario': user._id },
        { $set: { 'turnos.$.estado': 'cancelado' } },
        { new: true }
      );

      if (!turnoCancelado) {
        throw new Error('No tienes permiso para cancelar este turno o no existe.');
      }
    } else if (user.rol === 'admin') {
      turnoCancelado = await FechaTurnoModel.findOneAndUpdate(
        { 'turnos._id': turnoId },
        { $set: { 'turnos.$.estado': 'cancelado' } },
        { new: true }
      );
    }

    const turnoOriginal = turnoCancelado.turnos.find(turno => turno._id.toString() === turnoId);

    if (!turnoOriginal) {
      throw new Error('El turno no se encontró.');
    }

    const nuevoTurno = {
      hora: turnoOriginal.hora,
      tipoAtencion: 'Consulta de producto',
      estado: 'libre',
      modalidad: 'online',
      usuario: null,
      descripcion: '',
    };

    const fechaTurnoActualizada = await FechaTurnoModel.findOneAndUpdate(
      { _id: turnoCancelado._id },
      { $push: { turnos: nuevoTurno } },
      { new: true }
    );

    ordenarTurnosPorHora(fechaTurnoActualizada);

    await fechaTurnoActualizada.save();

    return fechaTurnoActualizada;
  } catch (error) {
    throw new Error('No se pudo cancelar el turno.');
  }
};

export const modificarTurnoService = async (turnoId, actualizaciones) => {
  try {
    const fechaTurno = await FechaTurnoModel.findOne({ 'turnos._id': turnoId });

    if (!fechaTurno) {
      throw new Error('Turno no encontrado');
    }

    const turno = fechaTurno.turnos.id(turnoId);

    if (!turno) {
      throw new Error('Turno no encontrado');
    }

    if (actualizaciones.estado === 'completado') {
      const esHoraValida = verificarHoraEnRango(turno.hora, true, 2);
      if (!esHoraValida) {
        throw new Error('El turno solo puede completarse si está dentro del rango de las 2 horas siguientes a la hora actual');
      }
    }

    Object.assign(turno, actualizaciones);

    await fechaTurno.save();

    return fechaTurno;
  } catch (error) {
    throw new Error(`Error al modificar el turno: ${error.message}`);
  }
};

// Función que actualiza los turnos a "no asistido" si han pasado más de 30 min y no están completados
export const actualizarTurnosNoAsistidos = async (fechasTurnos) => {
  try {
    const turnosActualizadosPromises = fechasTurnos.flatMap(fechaTurno =>
      fechaTurno.turnos.map(async turno => {
        const turnoHora = moment.tz(`${fechaTurno.fecha.toISOString().split('T')[0]} ${turno.hora}`, 'America/Argentina/Buenos_Aires');
        const horaActual = moment.tz('America/Argentina/Buenos_Aires');
        const diferenciaEnMinutos = horaActual.diff(turnoHora, 'minutes');

        if (diferenciaEnMinutos >= 30 && turno.usuario && !['completado'].includes(turno.estado)) {
          turno.estado = 'no asistido';
          await FechaTurnoModel.findOneAndUpdate(
            { 'turnos._id': turno._id },
            { $set: { 'turnos.$.estado': 'no asistido' } },
            { new: true }
          );
        }

        if (diferenciaEnMinutos >= 0 && !turno.usuario && turno.estado === 'libre') {
          turno.estado = 'caducado';
          await FechaTurnoModel.findOneAndUpdate(
            { 'turnos._id': turno._id },
            { $set: { 'turnos.$.estado': 'caducado' } },
            { new: true }
          );
        }

        return turno.toObject();
      })
    );

    await Promise.all(turnosActualizadosPromises);
  } catch (error) {
    console.error('Error en actualizarTurnosNoAsistidos:', error);
    throw new Error('Error al actualizar los turnos a "no asistido" o "caducado"');
  }
};