import { crearTurnosSemanalesService, obtenerTurnosService, solicitarTurnoService, listaTurnosService, cancelarTurnoService, modificarTurnoService, obtenerTurnoService } from "../services/turnos.service.js";

export const obtenerTurnosController = async (req, res) => {
  try {
    const filters = req.filters || {};
    const result = await obtenerTurnosService(req.pagination, filters, req.user);

    return res.status(200).json({
      fechaTurnos: result.fechaTurnos,
      totalTurnos: result.totalTurnos,
      page: req.pagination ? req.pagination.page : null,
      limit: req.pagination ? req.pagination.limit : null
    });
  } catch (error) {
    const statusCode = error.message === 'Ya tienes un turno reservado para este día.' ? 400 : 500;
    return res.status(statusCode).json({ message: error.message || 'Error al obtener los turnos.' });
  }
};

export const obtenerTurnoController = async (req, res) => {
  try {
    const { fecha } = req.params;

    if (fecha) {
      const turnos = await obtenerTurnoService(fecha, req.user);
      if (!turnos) {
        return res.status(404).json({ message: 'No se encontraron turnos para la fecha especificada.' });
      }
      return res.status(200).json(turnos);
    } else {
      return res.status(404).json({ message: 'Fecha especificada inválida.' });
    }
  } catch (error) {
    const statusCode = error.message === 'Ya tienes un turno reservado para este día.' ? 400 : 500;
    return res.status(statusCode).json({ message: error.message || 'Error al obtener los turnos.' });
  }
};

export const listaTurnosController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: 'ID de usuario no proporcionado.' });
    }

    const turnos = await listaTurnosService(userId);

    if (!Array.isArray(turnos)) {
      return res.status(500).json({ message: 'Error al obtener los turnos del usuario.' });
    }

    if (turnos.length === 0) {
      return res.status(200).json({ message: 'No tiene turnos.' });
    }

    res.status(200).json(turnos);
  } catch (error) {
    console.error('Error al obtener los turnos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los turnos del usuario.' });
  }
};

export const crearTurnosSemanalesController = async (req, res) => {
  try {
    const creadorId = req.user._id;

    await crearTurnosSemanalesService(creadorId);

    res.status(201).json({ message: 'Turnos semanales creados con éxito' });
  } catch (error) {
    console.error('Error al crear los turnos semanales:', error);
    res.status(500).json({ message: 'Error al crear los turnos semanales' });
  }
};

export const solicitarTurnoController = async (req, res) => {
  try {
    const { fecha, hora, tipoAtencion, descripcion } = req.body;

    if (!fecha || !hora || !tipoAtencion) {
      return res.status(400).json({ message: 'La fecha, hora y tipo de atención son requeridos.' });
    }

    const usuarioId = req.user._id;

    const turnoSolicitado = await solicitarTurnoService(fecha, hora, usuarioId, tipoAtencion, descripcion);

    if (turnoSolicitado?.error) {
      return res.status(400).json({ message: turnoSolicitado.error });
    }

    if (turnoSolicitado) {
      return res.status(200).json({ message: 'Turno solicitado con éxito', turno: turnoSolicitado });
    } else {
      return res.status(400).json({ message: 'El turno ya está ocupado o no se encontró.' });
    }
  } catch (error) {
    console.error('Error al solicitar el turno:', error);
    res.status(500).json({ message: 'Error al solicitar el turno.' });
  }
};

export const cancelarTurnoController = async (req, res) => {
  try {
    const { turnoId } = req.body;
    if (!turnoId) {
      return res.status(400).json({ error: 'ID de turno requerido.' });
    }

    const turnoCancelado = await cancelarTurnoService(turnoId, req.user);

    if (!turnoCancelado) {
      return res.status(404).json({ error: 'Turno no encontrado o no se pudo cancelar.' });
    }

    return res.status(200).json({ message: 'Turno cancelado correctamente.', turno: turnoCancelado });
  } catch (error) {
    return res.status(500).json({ error: 'Error al cancelar el turno.' });
  }
};

export const modificarTurnoController = async (req, res) => {
  try {
    const { turnoId } = req.params;
    const actualizaciones = req.body;

    if (!turnoId || !actualizaciones) {
      return res.status(400).json({ error: 'Faltan datos necesarios en la solicitud' });
    }

    const fechaTurnoActualizada = await modificarTurnoService(turnoId, actualizaciones);

    res.status(200).json(fechaTurnoActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};