import { Outlet, Route } from 'react-router-dom';
import CounselingList from '../pages/counseling/CounselingList';
import CounselBoard from '../pages/counseling/online/CounselBoard';
import CounselWriteForm from '../pages/counseling/online/CounselWriteForm';
import CounselDetailView from '../pages/counseling/online/CounselDetailView';
import CounselAnswerForm from '../pages/counseling/online/CounselAnswerForm';



const CounselingRouter = (
  <Route path="/counsel" element={<Outlet/>}>
    <Route index element={<CounselingList/>}/>
    <Route path="online" element={<CounselBoard/>}/>
    <Route path="online/write" element={<CounselWriteForm/>}/>
    <Route path="online/edit/:id" element={<CounselWriteForm />} />
    <Route path="online/detail/:id" element={<CounselDetailView />} />
    <Route path="online/answer/:id" element={<CounselAnswerForm />} />
    <Route path="online/answer/edit/:id" element={<CounselAnswerForm />} />
  </Route>
);

export default CounselingRouter;