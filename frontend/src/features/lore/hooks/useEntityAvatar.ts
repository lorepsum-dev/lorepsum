import { useCallback, useEffect, useState } from "react";

const DEFAULT_ENTITY_AVATAR_SRC = "/mythologies/avatars/default.png";

function useEntityAvatar(avatarUrl: string | null) {
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState(avatarUrl ?? DEFAULT_ENTITY_AVATAR_SRC);

  useEffect(() => {
    setResolvedAvatarUrl(avatarUrl ?? DEFAULT_ENTITY_AVATAR_SRC);
  }, [avatarUrl]);

  const handleAvatarError = useCallback(() => {
    setResolvedAvatarUrl((current) => (
      current === DEFAULT_ENTITY_AVATAR_SRC ? current : DEFAULT_ENTITY_AVATAR_SRC
    ));
  }, []);

  return {
    avatarSrc: resolvedAvatarUrl,
    onAvatarError: handleAvatarError,
  };
}

export { useEntityAvatar, DEFAULT_ENTITY_AVATAR_SRC };
