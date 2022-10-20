## [1.2.1]

### Updated
- Se cambia el orden de listado de apsiders en !status. Primero no asistidos y luego asistidos

## [1.2.0]

### Added
- Se añaden 4 nuevos comandos
- !ready
- !not-ready
- !status
- !commands

### Fixed
- se añade el prefijo /api a los endpoints del backend

## [1.1.0]

### Added
- Se añade websockets en update_assist, voiceStateUpdate, mandated_apsider

### Updated
- se actualiza update_assist, voiceStateUpdate, mandated_apsider

## [1.0.0]
### Added
- Se inicializa proyecto
- endpoints
  - archive_apsiders
  - get_apsiders
  - mandated_apsider
  - update_assist
- se añade e instancia discordjs
  - se añade voiceStateUpdate
  - se añade comandos
    - !join-channel (une a andres al voice channel #daily)
    - !sync-users (sincroniza bd con server apside discord)
- se añade cron
  - resetAssisted.js (pone assisted = 0 a todos)
- tengo sueño

