import React from 'react'
import { createRoot } from 'react-dom/client'
import { setupIonicReact } from '@ionic/react'

/* CSS base de Ionic */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import '@fontsource/barlow-condensed/800-italic.css'

import './styles/global.scss'
import App from './App.jsx'

setupIonicReact()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)