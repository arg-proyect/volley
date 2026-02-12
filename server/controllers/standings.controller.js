import pool from '../config/database.js';

// Obtener tabla de posiciones por categoría
export const getStandingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Obtener todos los partidos finalizados de la categoría
    const [matches] = await pool.query(
      `SELECT m.*, 
              t1.name as team1_name, t1.short_name as team1_short,
              t2.name as team2_name, t2.short_name as team2_short
       FROM matches m
       LEFT JOIN teams t1 ON m.team1_id = t1.id
       LEFT JOIN teams t2 ON m.team2_id = t2.id
       WHERE m.category = ? AND m.status = 'finished'`,
      [category]
    );

    // Obtener todos los equipos únicos que participaron
    const teamsMap = new Map();

    matches.forEach(match => {
      // Inicializar team1 si no existe
      if (!teamsMap.has(match.team1_id)) {
        teamsMap.set(match.team1_id, {
          id: match.team1_id,
          name: match.team1_name,
          short_name: match.team1_short,
          played: 0,
          won: 0,
          lost: 0,
          sets_for: 0,
          sets_against: 0,
          points: 0
        });
      }

      // Inicializar team2 si no existe
      if (!teamsMap.has(match.team2_id)) {
        teamsMap.set(match.team2_id, {
          id: match.team2_id,
          name: match.team2_name,
          short_name: match.team2_short,
          played: 0,
          won: 0,
          lost: 0,
          sets_for: 0,
          sets_against: 0,
          points: 0
        });
      }

      // Actualizar estadísticas
      const team1Stats = teamsMap.get(match.team1_id);
      const team2Stats = teamsMap.get(match.team2_id);

      team1Stats.played++;
      team2Stats.played++;

      team1Stats.sets_for += match.score1;
      team1Stats.sets_against += match.score2;
      team2Stats.sets_for += match.score2;
      team2Stats.sets_against += match.score1;

      // Determinar ganador (victoria = 3 puntos, derrota = 0 puntos)
      if (match.score1 > match.score2) {
        team1Stats.won++;
        team1Stats.points += 3;
        team2Stats.lost++;
      } else if (match.score2 > match.score1) {
        team2Stats.won++;
        team2Stats.points += 3;
        team1Stats.lost++;
      }
    });

    // Convertir el mapa a array y ordenar
    const standings = Array.from(teamsMap.values())
      .map(team => ({
        ...team,
        diff: team.sets_for - team.sets_against
      }))
      .sort((a, b) => {
        // Ordenar por puntos descendente
        if (b.points !== a.points) return b.points - a.points;
        // Si tienen mismos puntos, ordenar por diferencia de sets
        if (b.diff !== a.diff) return b.diff - a.diff;
        // Si tienen misma diferencia, ordenar por sets a favor
        return b.sets_for - a.sets_for;
      })
      .map((team, index) => ({
        position: index + 1,
        ...team
      }));

    res.json(standings);
  } catch (error) {
    console.error('Error en getStandingsByCategory:', error);
    res.status(500).json({ error: 'Error al obtener tabla de posiciones' });
  }
};

// Obtener todas las tablas de posiciones (todas las categorías)
export const getAllStandings = async (req, res) => {
  try {
    // Obtener todas las categorías únicas
    const [categories] = await pool.query(
      'SELECT DISTINCT category FROM matches WHERE status = "finished" ORDER BY category'
    );

    const allStandings = {};

    for (const cat of categories) {
      const [matches] = await pool.query(
        `SELECT m.*, 
                t1.name as team1_name, t1.short_name as team1_short,
                t2.name as team2_name, t2.short_name as team2_short
         FROM matches m
         LEFT JOIN teams t1 ON m.team1_id = t1.id
         LEFT JOIN teams t2 ON m.team2_id = t2.id
         WHERE m.category = ? AND m.status = 'finished'`,
        [cat.category]
      );

      const teamsMap = new Map();

      matches.forEach(match => {
        if (!teamsMap.has(match.team1_id)) {
          teamsMap.set(match.team1_id, {
            id: match.team1_id,
            name: match.team1_name,
            short_name: match.team1_short,
            played: 0,
            won: 0,
            lost: 0,
            sets_for: 0,
            sets_against: 0,
            points: 0
          });
        }

        if (!teamsMap.has(match.team2_id)) {
          teamsMap.set(match.team2_id, {
            id: match.team2_id,
            name: match.team2_name,
            short_name: match.team2_short,
            played: 0,
            won: 0,
            lost: 0,
            sets_for: 0,
            sets_against: 0,
            points: 0
          });
        }

        const team1Stats = teamsMap.get(match.team1_id);
        const team2Stats = teamsMap.get(match.team2_id);

        team1Stats.played++;
        team2Stats.played++;

        team1Stats.sets_for += match.score1;
        team1Stats.sets_against += match.score2;
        team2Stats.sets_for += match.score2;
        team2Stats.sets_against += match.score1;

        if (match.score1 > match.score2) {
          team1Stats.won++;
          team1Stats.points += 3;
          team2Stats.lost++;
        } else if (match.score2 > match.score1) {
          team2Stats.won++;
          team2Stats.points += 3;
          team1Stats.lost++;
        }
      });

      const standings = Array.from(teamsMap.values())
        .map(team => ({
          ...team,
          diff: team.sets_for - team.sets_against
        }))
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.diff !== a.diff) return b.diff - a.diff;
          return b.sets_for - a.sets_for;
        })
        .map((team, index) => ({
          position: index + 1,
          ...team
        }));

      allStandings[cat.category] = standings;
    }

    res.json(allStandings);
  } catch (error) {
    console.error('Error en getAllStandings:', error);
    res.status(500).json({ error: 'Error al obtener tablas de posiciones' });
  }
};
