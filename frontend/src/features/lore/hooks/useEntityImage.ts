import { useCallback, useEffect, useState } from "react";

const DEFAULT_ENTITY_IMAGE_SRC = "/mythologies/avatars/default.png";
const DEFAULT_CARD_BACK_IMAGE_SRC = "/lorepsum/card-back.svg";

function useEntityImage(imageUrl: string | null) {
  const [resolvedImageUrl, setResolvedImageUrl] = useState(imageUrl ?? DEFAULT_ENTITY_IMAGE_SRC);

  useEffect(() => {
    setResolvedImageUrl(imageUrl ?? DEFAULT_ENTITY_IMAGE_SRC);
  }, [imageUrl]);

  const handleImageError = useCallback(() => {
    setResolvedImageUrl((current) => (
      current === DEFAULT_ENTITY_IMAGE_SRC ? current : DEFAULT_ENTITY_IMAGE_SRC
    ));
  }, []);

  return {
    imageSrc: resolvedImageUrl,
    onImageError: handleImageError,
  };
}

function useEntityBackImage() {
  const [resolvedImageUrl, setResolvedImageUrl] = useState(DEFAULT_CARD_BACK_IMAGE_SRC);

  const handleImageError = useCallback(() => {
    setResolvedImageUrl((current) => (
      current === DEFAULT_ENTITY_IMAGE_SRC ? current : DEFAULT_ENTITY_IMAGE_SRC
    ));
  }, []);

  return {
    imageSrc: resolvedImageUrl,
    onImageError: handleImageError,
  };
}

export {
  useEntityImage,
  useEntityBackImage,
  DEFAULT_ENTITY_IMAGE_SRC,
  DEFAULT_CARD_BACK_IMAGE_SRC,
};
