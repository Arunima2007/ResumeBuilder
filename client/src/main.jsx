// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from 'react' // In older versions of react <17 it was imported because react contains modern features and styling features
// but in >17 versions it is optional to import
import ReactDOM from 'react-dom/client' 
import App from './App.jsx' // main component which contains the entire application ui
import './index.css' // the main css file that contains standard styling
import './styles/styles.css'; // contains style that are shared across different pages like color and size of buttons remains same across diff components in order to main consistency
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>,
)
// strictMode is used in development mode
// it is used identify potential bugs,deprecated apis
// it may run twice 
// not applicable in production mode
