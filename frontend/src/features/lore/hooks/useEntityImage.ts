import { useCallback, useEffect, useState } from "react";

const DEFAULT_ENTITY_IMAGE_SRC = "/mythologies/avatars/default.png";

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

export { useEntityImage, DEFAULT_ENTITY_IMAGE_SRC };
