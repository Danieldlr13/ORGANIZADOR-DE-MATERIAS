#!/bin/bash
# Script para desplegar a Firebase con variables de entorno

# Cargar variables del .env.local
export $(grep -v '^#' .env.local | xargs)

# Build con las variables
npm run build

# Desplegar
firebase deploy --only hosting
