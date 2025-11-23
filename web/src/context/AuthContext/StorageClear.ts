// utils/clearAuthData.ts

export const StorageClear = (): void => {
  localStorage.removeItem("Nexion-user");

  // Clear cookie
  document.cookie = "Nexion-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
