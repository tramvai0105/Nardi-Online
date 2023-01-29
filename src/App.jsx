import './App.css';
import Field from './maincomponents/Field';
import {Route, Routes, BrowserRouter, Navigate} from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={`/f${(+new Date()).toString(16)}`} replace/>}/>
        <Route path='/:id' element={
          <div className="App">
            <Field/>
          </div>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
