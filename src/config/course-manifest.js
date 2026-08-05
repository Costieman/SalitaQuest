(() => {
  "use strict";

  const sharedStyles = [
    "ui-quality-fixes.css?v=sandbox-deletion-pass-1",
    "ui-answer-breakdown.css?v=sandbox-deletion-pass-1",
    "incorrect-order-feedback.css?v=sandbox-deletion-pass-1",
    "compact-desktop-layout.css?v=sandbox-deletion-pass-1",
    "compact-home-dashboard.css?v=sandbox-deletion-pass-1",
    "weekly-avatar-chest.css?v=sandbox-deletion-pass-1",
    "clean-topbar.css?v=sandbox-deletion-pass-1",
    "world-progress-status.css?v=sandbox-deletion-pass-1",
    "mastery-feedback.css?v=sandbox-deletion-pass-1",
    "mastery-console-overrides.css?v=sandbox-deletion-pass-1",
    "lesson-side-launcher.css?v=sandbox-deletion-pass-1",
    "mobile-session-refinement.css?v=sandbox-deletion-pass-1",
    "profile-emblem-control.css?v=sandbox-deletion-pass-1",
    "level-progression.css?v=sandbox-deletion-pass-1",
    "fluid-desktop-app.css?v=sandbox-deletion-pass-1",
    "adaptive-scenarios.css?v=sandbox-deletion-pass-1",
    "desktop-navigation-refinement.css?v=sandbox-deletion-pass-1",
    "badge-catalogue.css?v=sandbox-deletion-pass-1",
    "badge-layout.css?v=sandbox-deletion-pass-1",
    "badge-chest.css?v=sandbox-deletion-pass-1",
    "placement-onboarding.css?v=sandbox-deletion-pass-1",
    "social-connections.css?v=sandbox-deletion-pass-1",
    "achievement-sharing.css?v=sandbox-deletion-pass-1"
  ];

  const tagalogScripts = [
    "progression.js?v=sandbox-deletion-pass-1",
    "exercise-fixes.js?v=sandbox-deletion-pass-1",
    "ui-quality-fixes.js?v=sandbox-deletion-pass-1",
    "daily-goal-refinement.js?v=sandbox-deletion-pass-1",
    "weekly-avatar-chest.js?v=sandbox-deletion-pass-1",
    "key-run-refinement.js?v=sandbox-deletion-pass-1",
    "weekly-avatar-polish.js?v=sandbox-deletion-pass-1",
    "src/adapters/exercise/incorrect-order-feedback-runtime.js?v=sandbox-deletion-pass-1",
    "src/features/exercise/incorrect-order-feedback.js?v=sandbox-deletion-pass-1",
    "incorrect-order-feedback.js?v=sandbox-deletion-pass-1",
    "src/features/interface/compact-desktop-layout.js?v=sandbox-deletion-pass-1",
    "src/features/interface/clean-topbar.js?v=sandbox-deletion-pass-1",
    "src/features/progression/even-progress-rail.js?v=sandbox-deletion-pass-1",
    "mastery-feedback.js?v=sandbox-deletion-pass-1",
    "lesson-side-launcher.js?v=sandbox-deletion-pass-1",
    "mobile-session-refinement.js?v=sandbox-deletion-pass-1",
    "src/features/interface/popup-governor.js?v=sandbox-deletion-pass-1",
    "profile-app.js?v=sandbox-deletion-pass-1",
    "profile-emblem-control.js?v=sandbox-deletion-pass-1",
    "adaptive-scenarios.js?v=sandbox-deletion-pass-1",
    "level-progression.js?v=sandbox-deletion-pass-1",
    "src/features/interface/level-up-mobile-safety.js?v=sandbox-deletion-pass-1",
    "desktop-navigation-refinement.js?v=sandbox-deletion-pass-1",
    "src/features/audio/pronunciation-release-control.js?v=sandbox-deletion-pass-1",
    "src/features/progression/home-reward-coordinator.js?v=sandbox-deletion-pass-1",
    "badge-catalogue.js?v=sandbox-deletion-pass-1",
    "badge-chest.js?v=sandbox-deletion-pass-1",
    "placement-onboarding.js?v=sandbox-deletion-pass-1",
    "social-connections.js?v=sandbox-deletion-pass-1",
    "achievement-sharing.js?v=sandbox-deletion-pass-1",
    "src/features/interface/collection-key-translation.js?v=sandbox-deletion-pass-1"
  ];

  const cebuanoScripts = [
    "bisaya-app-loader.js?v=sandbox-deletion-pass-1",
    "ui-quality-fixes.js?v=sandbox-deletion-pass-1",
    "daily-goal-refinement.js?v=sandbox-deletion-pass-1",
    "weekly-avatar-chest.js?v=sandbox-deletion-pass-1",
    "key-run-refinement.js?v=sandbox-deletion-pass-1",
    "weekly-avatar-polish.js?v=sandbox-deletion-pass-1",
    "src/adapters/exercise/incorrect-order-feedback-runtime.js?v=sandbox-deletion-pass-1",
    "src/features/exercise/incorrect-order-feedback.js?v=sandbox-deletion-pass-1",
    "incorrect-order-feedback.js?v=sandbox-deletion-pass-1",
    "src/features/interface/compact-desktop-layout.js?v=sandbox-deletion-pass-1",
    "src/features/interface/clean-topbar.js?v=sandbox-deletion-pass-1",
    "src/features/progression/even-progress-rail.js?v=sandbox-deletion-pass-1",
    "mastery-feedback.js?v=sandbox-deletion-pass-1",
    "lesson-side-launcher.js?v=sandbox-deletion-pass-1",
    "mobile-session-refinement.js?v=sandbox-deletion-pass-1",
    "src/features/interface/popup-governor.js?v=sandbox-deletion-pass-1",
    "profile-emblem-control.js?v=sandbox-deletion-pass-1",
    "adaptive-scenarios.js?v=sandbox-deletion-pass-1",
    "level-progression.js?v=sandbox-deletion-pass-1",
    "src/features/interface/level-up-mobile-safety.js?v=sandbox-deletion-pass-1",
    "desktop-navigation-refinement.js?v=sandbox-deletion-pass-1",
    "src/features/audio/pronunciation-release-control.js?v=sandbox-deletion-pass-1",
    "src/features/progression/home-reward-coordinator.js?v=sandbox-deletion-pass-1",
    "badge-catalogue.js?v=sandbox-deletion-pass-1",
    "badge-chest.js?v=sandbox-deletion-pass-1",
    "placement-onboarding.js?v=sandbox-deletion-pass-1",
    "social-connections.js?v=sandbox-deletion-pass-1",
    "achievement-sharing.js?v=sandbox-deletion-pass-1"
  ];

  const desktopCollectionSafety = "@media(min-width:900px){.avatar-collection-modal,.sq-desktop-collection-safe,[data-avatar-collection-modal]{max-height:calc(100dvh - 32px)!important;overflow:hidden!important}.avatar-collection-modal .modal-content,.sq-desktop-collection-safe .modal-content,.avatar-collection-modal [role=tabpanel],.sq-desktop-collection-safe [role=tabpanel]{max-height:calc(100dvh - 190px)!important;overflow-y:auto!important;overscroll-behavior:contain}.avatar-case-slot img,.avatar-card img,.sq-desktop-collection-safe img{object-fit:contain!important;object-position:center!important;max-width:100%!important;max-height:100%!important}}";

  window.SalitaQuestCourseManifest = Object.freeze({
    sourceDocument: "https://raw.githubusercontent.com/Costieman/SalitaQuest/cb89fa4778737b16408bd5a66dd8fcc7f7f37f81/index.html",
    storage: Object.freeze({
      profileStore: "salitaQuestLocalProfilesV1",
      activeProfile: "salitaQuestActiveProfileId",
      activeCourse: "salitaQuestActiveCourse",
      baseProgress: "salitaQuestProgress",
      baseOwner: "salitaQuestBaseProgressOwner",
      profileProgressPrefix: "salitaQuestProgress.profile."
    }),
    courses: Object.freeze({
      tagalog: Object.freeze({
        id: "tagalog",
        documentCache: "salitaQuestAppDocumentV554",
        styles: Object.freeze([...sharedStyles]),
        scripts: Object.freeze([...tagalogScripts]),
        scriptStrategy: "append",
        useLegacyProfileProgress: true,
        extraHeadCss: desktopCollectionSafety,
        errorMark: "S★",
        errorTitle: "Course files could not be loaded",
        errorMessage: "Check your connection, then reload this page. Your learner profile and saved progress remain on this device.",
        replacements: Object.freeze([])
      }),
      cebuano: Object.freeze({
        id: "cebuano",
        documentCache: "salitaQuestBisayaAppDocumentV554",
        styles: Object.freeze(["bisaya-review-regions.css?v=sandbox-deletion-pass-1", ...sharedStyles]),
        scripts: Object.freeze([...cebuanoScripts]),
        scriptStrategy: "replace-app",
        useLegacyProfileProgress: false,
        extraHeadCss: "",
        errorMark: "B★",
        errorTitle: "Bisaya course files could not be loaded",
        errorMessage: "Check your connection, then reload this page. Saved Tagalog and Bisaya progress remain separate on this device.",
        replacements: Object.freeze([
          Object.freeze(["Tagalog", "Bisaya"]),
          Object.freeze(["Taglish", "Bisaya-English"]),
          Object.freeze(["Magandang araw!", "Maayong adlaw!"]),
          Object.freeze(["taga-saan?</span>", "taga-asa?</span>"])
        ])
      })
    })
  });
})();
