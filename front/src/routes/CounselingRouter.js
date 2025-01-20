import { Route } from 'react-router-dom';
import CounselingList from '../pages/counseling/CounselingList';
import Board from '../component/common/Board';



const CounselingRouter = (
  <Route path="/counsel" element={<CounselingList/>}>
    <Route path="onlineCounsel" element={<Board type="onlineCounsel"/>}/>
    <Route path="offlineCounsel" element={<Board type="offlineCounsel"/>}/>
    <Route path="realTimeCounsel" element={<Board type="realTimeCounsel"/>}/>
  </Route>
);

export default CounselingRouter;