import type { DriveStep } from "driver.js";

export const dashboardTutorialSteps: DriveStep[] = [
  {
    element: "#welcome-message",
    popover: {
      title: "Welcome to Braille Learning! 👋",
      description: "Let me show you around. This tutorial will help you get started with the platform.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#progress-overview",
    popover: {
      title: "Your Progress",
      description: "Here you can see your overall learning progress, completed modules, and scores.",
      side: "bottom",
    },
  },
  {
    element: "#quick-actions",
    popover: {
      title: "Quick Actions",
      description: "Use these shortcuts to quickly access learning modules, practice exercises, AI tutor, and your progress.",
      side: "top",
    },
  },
  {
    element: "#sidebar-nav",
    popover: {
      title: "Navigation Menu",
      description: "Access all features from this sidebar. You can navigate using keyboard (Tab, Enter, Arrow keys).",
      side: "right",
    },
  },
  {
    element: "#braille-reference",
    popover: {
      title: "Braille Quick Reference",
      description: "Quick access to Braille alphabet reference. Click here anytime you need to check a character.",
      side: "right",
    },
  },
  {
    element: "#user-menu",
    popover: {
      title: "User Menu",
      description: "Access your profile settings and sign out from here.",
      side: "left",
    },
  },
  {
    popover: {
      title: "All Set! 🎉",
      description: "You're ready to start learning! Click 'Start Learning' to begin your first module. Press 'H' anytime to replay this tutorial.",
    },
  },
];

export const modulesTutorialSteps: DriveStep[] = [
  {
    element: "#modules-list",
    popover: {
      title: "Learning Modules",
      description: "Here are all 10 learning modules. Start with Module 1 and unlock the next ones by completing each module.",
      side: "top",
    },
  },
  {
    element: ".module-card:first-child",
    popover: {
      title: "Module Cards",
      description: "Each card shows the module title, difficulty level, number of lessons, and completion status.",
      side: "right",
    },
  },
  {
    element: ".module-difficulty-badge",
    popover: {
      title: "Difficulty Levels",
      description: "Modules are categorized as Beginner or Intermediate. Start with Beginner modules first.",
      side: "bottom",
    },
  },
];

export const lessonTutorialSteps: DriveStep[] = [
  {
    element: "#lesson-content",
    popover: {
      title: "Lesson Content",
      description: "Read the lesson content here. You can use the 'Read Aloud' button to hear the content.",
      side: "top",
    },
  },
  {
    element: "#braille-display",
    popover: {
      title: "Braille Display",
      description: "This shows the Braille representation. You can also hear it spoken aloud.",
      side: "bottom",
    },
  },
  {
    element: "#lesson-navigation",
    popover: {
      title: "Navigation",
      description: "Use Previous/Next buttons to navigate between lessons. Mark each lesson as complete as you finish.",
      side: "top",
    },
  },
];

