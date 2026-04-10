// Role-based access control middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`,
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Page access control middleware
export const checkPageAccess = (pageName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this page.",
        requiresAuth: true,
      });
    }

    const userRole = req.user.role;
    const accessiblePages = {
      admin: [
        "Home",
        "About Us",
        "Feed",
        "Dashboard",
        "Admin Posts",
        "Contact Us",
      ],
      hr: ["Home", "About Us", "Feed", "Dashboard", "Contact Us"],
      recruiter: ["Home", "About Us", "Feed", "Dashboard", "Contact Us"],
      manager: ["Home", "About Us", "Feed", "Dashboard", "Contact Us"],
      user: ["Home", "About Us", "Feed", "Contact Us"],
    };

    if (!accessiblePages[userRole]?.includes(pageName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} role cannot access ${pageName} page.`,
        accessiblePages: accessiblePages[userRole] || [],
        requestedPage: pageName,
      });
    }

    next();
  };
};

// Get user accessible pages
export const getAccessiblePages = (userRole) => {
  const pageAccess = {
    admin: [
      { name: "Home", path: "/", icon: "home" },
      { name: "About Us", path: "/about", icon: "info" },
      { name: "Feed", path: "/feed", icon: "rss" },
      { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
      { name: "Admin Posts", path: "/admin/posts", icon: "admin" },
      { name: "Contact Us", path: "/contact", icon: "contact" },
    ],
    hr: [
      { name: "Home", path: "/", icon: "home" },
      { name: "About Us", path: "/about", icon: "info" },
      { name: "Feed", path: "/feed", icon: "rss" },
      { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
      { name: "Contact Us", path: "/contact", icon: "contact" },
    ],
    recruiter: [
      { name: "Home", path: "/", icon: "home" },
      { name: "About Us", path: "/about", icon: "info" },
      { name: "Feed", path: "/feed", icon: "rss" },
      { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
      { name: "Contact Us", path: "/contact", icon: "contact" },
    ],
    manager: [
      { name: "Home", path: "/", icon: "home" },
      { name: "About Us", path: "/about", icon: "info" },
      { name: "Feed", path: "/feed", icon: "rss" },
      { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
      { name: "Contact Us", path: "/contact", icon: "contact" },
    ],
    user: [
      { name: "Home", path: "/", icon: "home" },
      { name: "About Us", path: "/about", icon: "info" },
      { name: "Feed", path: "/feed", icon: "rss" },
      { name: "Contact Us", path: "/contact", icon: "contact" },
    ],
  };

  return pageAccess[userRole] || pageAccess.user;
};
