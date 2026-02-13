USE laliga_db;

DELETE FROM matches;

INSERT INTO matches (team1_id, team2_id, score1, score2, match_date, category, tournament_id, status) VALUES
-- Torneo de Verano (tournament_id = 1)
(1, 2, 1, 3, '2026-02-08 18:00:00', 'Superiores', 1, 'finished'),
(3, 4, 3, 2, '2026-02-08 19:00:00', 'Superiores', 1, 'finished'),
(5, 6, 3, 1, '2026-02-08 20:00:00', 'Superiores', 1, 'finished'),
(7, 8, 3, 1, '2026-02-08 18:30:00', 'Superiores', 1, 'finished'),
(9, 10, 3, 0, '2026-02-08 19:30:00', 'Superiores', 1, 'finished'),
(11, 12, 3, 0, '2026-02-08 20:30:00', 'Superiores', 1, 'finished'),
(13, 14, 0, 3, '2026-02-08 21:00:00', 'Superiores', 1, 'finished'),
(15, 16, 0, 3, '2026-02-08 21:30:00', 'Superiores', 1, 'finished'),
(1, 3, 0, 0, '2026-02-15 18:00:00', 'Superiores', 1, 'scheduled'),
(5, 7, 0, 0, '2026-02-15 19:00:00', 'Superiores', 1, 'scheduled'),
(9, 11, 0, 0, '2026-02-15 20:00:00', 'Superiores', 1, 'scheduled'),
(13, 15, 0, 0, '2026-02-15 21:00:00', 'Superiores', 1, 'scheduled'),
-- Open Cañuelas (tournament_id = 2)
(17, 18, 3, 1, '2026-02-05 16:00:00', 'Mayores', 2, 'finished'),
(19, 1, 2, 3, '2026-02-05 17:00:00', 'Mayores', 2, 'finished'),
(2, 3, 3, 0, '2026-02-05 18:00:00', 'Mayores', 2, 'finished'),
(4, 5, 1, 3, '2026-02-05 19:00:00', 'Mayores', 2, 'finished'),
(6, 7, 3, 2, '2026-02-06 16:00:00', 'Mayores', 2, 'finished'),
(8, 9, 0, 3, '2026-02-06 17:00:00', 'Mayores', 2, 'finished'),
(17, 2, 0, 0, '2026-02-12 16:00:00', 'Mayores', 2, 'scheduled'),
(3, 5, 0, 0, '2026-02-12 17:00:00', 'Mayores', 2, 'scheduled');
