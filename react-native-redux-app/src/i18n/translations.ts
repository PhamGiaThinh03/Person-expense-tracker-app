/**
 * Translations for the application
 *
 * This file contains translations for all text strings used in the application.
 * Add new languages by adding a new key to the translations object.
 */

export type SupportedLanguage = "en" | "vi" | "es" | "fr";

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  // English translations
  en: {
    // SelectIncomeScreen
    "selectIncomeType.title": "Select Income Type",
    "selectIncomeType.income": "Income",
    "selectIncomeType.salary": "Salary",
    "selectIncomeType.salaryDescription": "Regular income from employment",
    "selectIncomeType.business": "Business",
    "selectIncomeType.businessDescription": "Income from business activities",
    "selectIncomeType.gifts": "Gifts",
    "selectIncomeType.giftsDescription": "Money received as gifts",
    "selectIncomeType.others": "Others",
    "selectIncomeType.othersDescription": "Other sources of income",
    "selectIncomeType.cancel": "Cancel",
    "selectIncomeType.confirm": "Confirm",
    "selectIncomeType.saveOffline": "Save Offline",
    "selectIncomeType.offlineMode": "Offline Mode",
    "selectIncomeType.pendingChanges": "Pending changes will sync when online",
    "selectIncomeType.swipeToGoBack": "Swipe right to go back",
    "selectIncomeType.home": "Home",
    "selectIncomeType.stats": "Stats",
    "selectIncomeType.profile": "Profile",

    // Validation and alerts
    "validation.selectionRequired": "Selection Required",
    "validation.pleaseSelectIncomeType":
      "Please select an income type before proceeding.",
    "validation.invalidSelection":
      "The selected income type is not valid. Please select again.",
    "alert.error": "Error",
    "alert.savingError":
      "There was a problem saving your selection. Please try again.",
    "alert.offlineNotification":
      "Your selection has been saved and will be synced when you're back online.",
    "alert.ok": "OK",

    // Accessibility
    "accessibility.goBack": "Go back",
    "accessibility.returnsToScreen": "Returns to the previous screen",
    "accessibility.selectAs": "Select {type} as your income type",
    "accessibility.cancelSelection": "Cancel selection",
    "accessibility.confirmSelection": "Confirm {type} as income type",
    "accessibility.disabledConfirm":
      "Confirm button, disabled until you select an income type",
    "accessibility.navigateTo": "Navigate to {screen} screen",
    "accessibility.selected": "Selected {type}",
    "accessibility.selectionSuccess": "{type} selected successfully",
  },

  // Vietnamese translations
  vi: {
    // SelectIncomeScreen
    "selectIncomeType.title": "Chọn Loại Thu Nhập",
    "selectIncomeType.income": "Thu Nhập",
    "selectIncomeType.salary": "Lương",
    "selectIncomeType.salaryDescription": "Thu nhập thường xuyên từ việc làm",
    "selectIncomeType.business": "Kinh Doanh",
    "selectIncomeType.businessDescription": "Thu nhập từ hoạt động kinh doanh",
    "selectIncomeType.gifts": "Quà Tặng",
    "selectIncomeType.giftsDescription": "Tiền nhận được như quà tặng",
    "selectIncomeType.others": "Khác",
    "selectIncomeType.othersDescription": "Các nguồn thu nhập khác",
    "selectIncomeType.cancel": "Hủy",
    "selectIncomeType.confirm": "Xác Nhận",
    "selectIncomeType.saveOffline": "Lưu Ngoại Tuyến",
    "selectIncomeType.offlineMode": "Chế Độ Ngoại Tuyến",
    "selectIncomeType.pendingChanges":
      "Thay đổi đang chờ sẽ đồng bộ khi trực tuyến",
    "selectIncomeType.swipeToGoBack": "Vuốt sang phải để quay lại",
    "selectIncomeType.home": "Trang Chủ",
    "selectIncomeType.stats": "Thống Kê",
    "selectIncomeType.profile": "Hồ Sơ",

    // Validation and alerts
    "validation.selectionRequired": "Yêu Cầu Lựa Chọn",
    "validation.pleaseSelectIncomeType":
      "Vui lòng chọn loại thu nhập trước khi tiếp tục.",
    "validation.invalidSelection":
      "Loại thu nhập đã chọn không hợp lệ. Vui lòng chọn lại.",
    "alert.error": "Lỗi",
    "alert.savingError":
      "Đã xảy ra sự cố khi lưu lựa chọn của bạn. Vui lòng thử lại.",
    "alert.offlineNotification":
      "Lựa chọn của bạn đã được lưu và sẽ được đồng bộ hóa khi bạn trực tuyến trở lại.",
    "alert.ok": "OK",

    // Accessibility
    "accessibility.goBack": "Quay lại",
    "accessibility.returnsToScreen": "Trở về màn hình trước",
    "accessibility.selectAs": "Chọn {type} làm loại thu nhập của bạn",
    "accessibility.cancelSelection": "Hủy lựa chọn",
    "accessibility.confirmSelection": "Xác nhận {type} làm loại thu nhập",
    "accessibility.disabledConfirm":
      "Nút xác nhận, bị vô hiệu hóa cho đến khi bạn chọn loại thu nhập",
    "accessibility.navigateTo": "Điều hướng đến màn hình {screen}",
    "accessibility.selected": "Đã chọn {type}",
    "accessibility.selectionSuccess": "{type} đã được chọn thành công",
  },

  // Spanish translations
  es: {
    // SelectIncomeScreen
    "selectIncomeType.title": "Seleccionar Tipo de Ingreso",
    "selectIncomeType.income": "Ingreso",
    "selectIncomeType.salary": "Salario",
    "selectIncomeType.salaryDescription": "Ingreso regular de empleo",
    "selectIncomeType.business": "Negocio",
    "selectIncomeType.businessDescription":
      "Ingresos de actividades comerciales",
    "selectIncomeType.gifts": "Regalos",
    "selectIncomeType.giftsDescription": "Dinero recibido como regalos",
    "selectIncomeType.others": "Otros",
    "selectIncomeType.othersDescription": "Otras fuentes de ingresos",
    "selectIncomeType.cancel": "Cancelar",
    "selectIncomeType.confirm": "Confirmar",
    "selectIncomeType.saveOffline": "Guardar Sin Conexión",
    "selectIncomeType.offlineMode": "Modo Sin Conexión",
    "selectIncomeType.pendingChanges":
      "Los cambios pendientes se sincronizarán cuando esté en línea",
    "selectIncomeType.swipeToGoBack": "Desliza a la derecha para volver",
    "selectIncomeType.home": "Inicio",
    "selectIncomeType.stats": "Estadísticas",
    "selectIncomeType.profile": "Perfil",

    // Validation and alerts
    "validation.selectionRequired": "Selección Requerida",
    "validation.pleaseSelectIncomeType":
      "Por favor, seleccione un tipo de ingreso antes de continuar.",
    "validation.invalidSelection":
      "El tipo de ingreso seleccionado no es válido. Por favor, seleccione de nuevo.",
    "alert.error": "Error",
    "alert.savingError":
      "Hubo un problema al guardar su selección. Por favor, inténtelo de nuevo.",
    "alert.offlineNotification":
      "Su selección se ha guardado y se sincronizará cuando vuelva a estar en línea.",
    "alert.ok": "OK",

    // Accessibility
    "accessibility.goBack": "Volver",
    "accessibility.returnsToScreen": "Vuelve a la pantalla anterior",
    "accessibility.selectAs": "Seleccionar {type} como su tipo de ingreso",
    "accessibility.cancelSelection": "Cancelar selección",
    "accessibility.confirmSelection": "Confirmar {type} como tipo de ingreso",
    "accessibility.disabledConfirm":
      "Botón de confirmación, deshabilitado hasta que seleccione un tipo de ingreso",
    "accessibility.navigateTo": "Navegar a la pantalla de {screen}",
    "accessibility.selected": "Seleccionado {type}",
    "accessibility.selectionSuccess": "{type} seleccionado con éxito",
  },

  // French translations
  fr: {
    // SelectIncomeScreen
    "selectIncomeType.title": "Sélectionner le Type de Revenu",
    "selectIncomeType.income": "Revenu",
    "selectIncomeType.salary": "Salaire",
    "selectIncomeType.salaryDescription": "Revenu régulier d'emploi",
    "selectIncomeType.business": "Entreprise",
    "selectIncomeType.businessDescription":
      "Revenus des activités commerciales",
    "selectIncomeType.gifts": "Cadeaux",
    "selectIncomeType.giftsDescription": "Argent reçu en cadeau",
    "selectIncomeType.others": "Autres",
    "selectIncomeType.othersDescription": "Autres sources de revenus",
    "selectIncomeType.cancel": "Annuler",
    "selectIncomeType.confirm": "Confirmer",
    "selectIncomeType.saveOffline": "Enregistrer Hors Ligne",
    "selectIncomeType.offlineMode": "Mode Hors Ligne",
    "selectIncomeType.pendingChanges":
      "Les modifications en attente seront synchronisées lorsque vous serez en ligne",
    "selectIncomeType.swipeToGoBack": "Glissez vers la droite pour revenir",
    "selectIncomeType.home": "Accueil",
    "selectIncomeType.stats": "Statistiques",
    "selectIncomeType.profile": "Profil",

    // Validation and alerts
    "validation.selectionRequired": "Sélection Requise",
    "validation.pleaseSelectIncomeType":
      "Veuillez sélectionner un type de revenu avant de continuer.",
    "validation.invalidSelection":
      "Le type de revenu sélectionné n'est pas valide. Veuillez sélectionner à nouveau.",
    "alert.error": "Erreur",
    "alert.savingError":
      "Un problème est survenu lors de l'enregistrement de votre sélection. Veuillez réessayer.",
    "alert.offlineNotification":
      "Votre sélection a été enregistrée et sera synchronisée lorsque vous serez de nouveau en ligne.",
    "alert.ok": "OK",

    // Accessibility
    "accessibility.goBack": "Retour",
    "accessibility.returnsToScreen": "Retourne à l'écran précédent",
    "accessibility.selectAs": "Sélectionner {type} comme type de revenu",
    "accessibility.cancelSelection": "Annuler la sélection",
    "accessibility.confirmSelection": "Confirmer {type} comme type de revenu",
    "accessibility.disabledConfirm":
      "Bouton de confirmation, désactivé jusqu'à ce que vous sélectionniez un type de revenu",
    "accessibility.navigateTo": "Naviguer vers l'écran {screen}",
    "accessibility.selected": "Sélectionné {type}",
    "accessibility.selectionSuccess": "{type} sélectionné avec succès",
  },
};

/**
 * Get a translated string for the given key and language
 *
 * @param key The translation key
 * @param language The language to use
 * @param params Optional parameters to replace in the string
 * @returns The translated string
 */
export function translate(
  key: string,
  language: SupportedLanguage = "en",
  params?: Record<string, string>,
): string {
  // Get the translation for the key
  const translation =
    translations[language]?.[key] || translations.en[key] || key;

  // Replace parameters if provided
  if (params) {
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(`{${param}}`, value),
      translation,
    );
  }

  return translation;
}

/**
 * Get the user's preferred language
 * Defaults to English if the preferred language is not supported
 *
 * @returns The user's preferred language code
 */
export function getPreferredLanguage(): SupportedLanguage {
  // Get the device language
  const deviceLanguage = (
    navigator?.language || // Web
    // @ts-ignore
    navigator?.userLanguage || // IE
    // @ts-ignore
    navigator?.browserLanguage || // IE
    "en"
  ).split("-")[0];

  // Check if the device language is supported
  if (Object.keys(translations).includes(deviceLanguage)) {
    return deviceLanguage as SupportedLanguage;
  }

  // Default to English
  return "en";
}
