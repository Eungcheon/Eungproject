import { Route } from 'react-router-dom';
import CounselingList from '../pages/counseling/CounselingList';



const CounselingRouter = (
  <Route path="/counsel" element={<CounselingList/>}/>
);

export default CounselingRouter;