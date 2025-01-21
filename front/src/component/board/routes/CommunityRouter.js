import { Route, Outlet } from 'react-router-dom';
import Board from '../component/common/Board';
import PostWriteForm from '../component/common/PostWriteForm';
import PostDetailView from '../component/common/PostDetailView';

const CommunityRouter = (
  <Route path="/community" element={<Outlet/>}>
    <Route path="notice" element={<Board type="notice" />} />
    <Route path="archive" element={<Board type="archive" />} />
    <Route path="faq" element={<Board type="faq" />} />
    <Route path=":type/write" element={<PostWriteForm />} />
    <Route path=":type/edit/:id" element={<PostWriteForm />} />
    <Route path=":type/detail/:id" element={<PostDetailView />} />
  </Route>
);

export default CommunityRouter;