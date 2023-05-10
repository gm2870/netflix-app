import LoadingTitle from './Loading-title/Loading-title';
import useSliderConfig from '../../hooks/use-slider-config';

const SliderLoader = () => {
  const { rowItems }: { rowItems: number } = useSliderConfig();
  const loadingBoxes = new Array(rowItems).fill(0).map((_, i) => {
    const animationDelay = i * 0.2 + 's';

    return (
      <LoadingTitle key={i} animationDelay={animationDelay}></LoadingTitle>
    );
  });

  return <div>{loadingBoxes}</div>;
};

export default SliderLoader;
