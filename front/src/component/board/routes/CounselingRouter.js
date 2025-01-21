import { Route } from 'react-router-dom';
import CounselingList from '../pages/counseling/CounselingList';
import Board from '../pages/counseling/online/CounselBoard';



const CounselingRouter = (
  <Route path="/counsel" element={<CounselingList/>}>
    <Route path="online" element={<Board/>}/>
  </Route>
);

export default CounselingRouter;