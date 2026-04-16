// Page access controller for frontend integration

export const getPageAccess = async (req, res) => {
  try {
    const { pageName } = req.params;

    // This will be handled by middleware
    res.status(200).json({
      success: true,
      message: `Access granted to ${pageName}`,
      pageName,
      userRole: req.user.role,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking page access",
      error: error.message,
    });
  }
};

export const getNavigation = async (req, res) => {
  try {
    const { getAccessiblePages } = await import("../middleware/roleAuth.js");
    const accessiblePages = getAccessiblePages(req.user.role);

    res.status(200).json({
      success: true,
      message: "Navigation retrieved successfully",
      userRole: req.user.role,
      pages: accessiblePages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving navigation",
      error: error.message,
    });
  }
};

export const getPublicPages = async (req, res) => {
  try {
    const publicPages = [
      {
        name: "Home",
        path: "/",
        icon: "home",
        description: "Main landing page",
      },
      {
        name: "About Us",
        path: "/about",
        icon: "info",
        description: "Company information and team details",
      },
      {
        name: "Contact Us",
        path: "/contact",
        icon: "contact",
        description: "Contact form and location information",
      },
    ];

    res.status(200).json({
      success: true,
      pages: publicPages,
      message: "Public pages accessible without authentication",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving public pages",
      error: error.message,
    });
  }
};
