import { CardGrid } from '../Components/CardGrid';
import { VectorBackground } from '../Components/VectorBackground';

export const Collection: React.FC = () => {
  return (
    <VectorBackground title={'Collection'}>
      <CardGrid nfts={{}} />
    </VectorBackground>
  );
};
