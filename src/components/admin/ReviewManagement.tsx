import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from "../../api/review.api";
import type { AdminReview } from "../../types/review.types";
import ReviewDetailsModal from "./ReviewDetailsModal";
import { ResponseStatus } from "../../types/response.types";
// Keep local Review type for backward compatibility with existing code
export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

// Demo data - can be easily cleared
const generateDemoReviews = (): Review[] => {
  const now = new Date();
  return [
    {
      id: "1",
      productId: "prod-1",
      productName: "Mindful Tea Set",
      userId: "user-1",
      userEmail: "maria.jacobs@example.com",
      userName: "Maria Jacobs",
      rating: 5,
      comment:
        "This is 10/10 super amazing. The quality is outstanding and I would definitely recommend this to everyone!",
      status: "PENDING",
      createdAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "2",
      productId: "prod-2",
      productName: "Aromatherapy Candle",
      userId: "user-2",
      userEmail: "john.smith@example.com",
      userName: "John Smith",
      rating: 5,
      comment:
        "Absolutely love this product! It exceeded my expectations in every way. The packaging was beautiful and the product itself is fantastic.",
      status: "APPROVED",
      createdAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "3",
      productId: "prod-1",
      productName: "Mindful Tea Set",
      userId: "user-3",
      userEmail: "sarah.williams@example.com",
      userName: "Sarah Williams",
      rating: 4,
      comment:
        "Great product overall. The quality is good and it arrived quickly. Would purchase again.",
      status: "APPROVED",
      createdAt: new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "4",
      productId: "prod-3",
      productName: "Wellness Essential Oil Bundle",
      userId: "user-4",
      userEmail: "david.brown@example.com",
      userName: "David Brown",
      rating: 5,
      comment:
        "Perfect! Exactly as described. Highly recommend this product to anyone looking for quality items.",
      status: "APPROVED",
      createdAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 9 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "5",
      productId: "prod-2",
      productName: "Aromatherapy Candle",
      userId: "user-5",
      userEmail: "emily.chen@example.com",
      userName: "Emily Chen",
      rating: 3,
      comment:
        "The product is okay, but I expected more based on the description. The scent is nice but doesn't last very long.",
      status: "PENDING",
      createdAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "6",
      productId: "prod-4",
      productName: "Yoga Mat Premium",
      userId: "user-6",
      userEmail: "michael.jones@example.com",
      userName: "Michael Jones",
      rating: 2,
      comment:
        "Not what I expected. The material feels cheap and it's not as thick as advertised. Would not recommend.",
      status: "REJECTED",
      createdAt: new Date(
        now.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "7",
      productId: "prod-1",
      productName: "Mindful Tea Set",
      userId: "user-7",
      userEmail: "lisa.anderson@example.com",
      userName: "Lisa Anderson",
      rating: 5,
      comment:
        "Absolutely fantastic! The tea set is beautifully crafted and the tea itself is delicious. Will definitely order again!",
      status: "PENDING",
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "8",
      productId: "prod-3",
      productName: "Wellness Essential Oil Bundle",
      userId: "user-8",
      userEmail: "robert.taylor@example.com",
      userName: "Robert Taylor",
      rating: 4,
      comment:
        "Good quality oils with nice scents. The bundle is great value for money. Delivery was fast too.",
      status: "APPROVED",
      createdAt: new Date(
        now.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 11 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];
};

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | ""
  >("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalReviews, setTotalReviews] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Load reviews from API
  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await getAdminReviews({
        page: page + 1,
        limit: rowsPerPage, // Backend expects 'limit', not 'pageSize'
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setReviews(response.data.reviews || []);
        setTotalReviews(response.data.pagination?.total || 0);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  const handleApprove = async (reviewId: string) => {
    try {
      await updateReviewStatus(reviewId, "APPROVED");
      toast.success("Review approved");
      await loadReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await updateReviewStatus(reviewId, "REJECTED");
      toast.success("Review rejected");
      await loadReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject review");
    }
  };

  const handleDeleteClick = (review: AdminReview) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (reviewToDelete) {
      try {
        await deleteReview(reviewToDelete.id);
        toast.success("Review deleted");
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
        await loadReviews();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to delete review"
        );
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const getStatusColor = (status: AdminReview["status"]) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        sx={{
          color: i < rating ? "#fbbf24" : "#e5e7eb",
          fontSize: "1rem",
        }}
      />
    ));
  };

  // Filter reviews based on status and search query
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesStatus = !statusFilter || review.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        review.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      return matchesStatus && matchesSearch;
    });
  }, [reviews, statusFilter, searchQuery]);

  // Use reviews directly from API (already paginated)
  const paginatedReviews = reviews;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    review: AdminReview
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleMenuAction = (action: "approve" | "reject" | "delete") => {
    if (!selectedReview) return;

    if (action === "delete") {
      handleDeleteClick(selectedReview);
    } else if (action === "approve") {
      handleApprove(selectedReview.id);
    } else if (action === "reject") {
      handleReject(selectedReview.id);
    }

    handleMenuClose();
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-2 sm:p-4 lg:p-0">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h2
            className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Product Reviews
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
            Manage and moderate product reviews submitted by users
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search by product or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                ),
              }}
              sx={{
                flex: { xs: 1, sm: 1 },
                minWidth: { xs: "100%", sm: 200 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
              <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "PENDING" | "APPROVED" | "REJECTED" | ""
                  )
                }
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>All</MenuItem>
                <MenuItem value="PENDING" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Pending</MenuItem>
                <MenuItem value="APPROVED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Approved</MenuItem>
                <MenuItem value="REJECTED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>User</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>Product</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Rating</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Comment</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Date</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                    <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </TableCell>
                </TableRow>
              ) : paginatedReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <StarIcon
                        sx={{
                          fontSize: { xs: 48, sm: 64 },
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontFamily: '"League Spartan", sans-serif',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {searchQuery || statusFilter
                          ? "No reviews found"
                          : "No reviews yet"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {searchQuery || statusFilter
                          ? "Try adjusting your search or filter criteria"
                          : "Reviews will appear here once customers submit them"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReviews.map((review) => (
                  <TableRow key={review.id} hover>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#00969b",
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {review.author.name?.[0]?.toUpperCase() ||
                            review.author.email?.[0]?.toUpperCase() ||
                            "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            {review.author.name || "Anonymous User"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                            {review.author.email || "No email"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {`Product ${review.productId}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {review.rating}/5
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                      <Tooltip title={review.comment || ""}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {review.comment || "No comment"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Chip
                        label={review.status}
                        color={getStatusColor(review.status)}
                        size="small"
                        sx={{
                          height: { xs: 20, sm: 24 },
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedReview(review);
                            setDetailsOpen(true);
                          }}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          <VisibilityIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, review)}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          <MoreVertIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalReviews}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              px: { xs: 1, sm: 2 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: { xs: 140, sm: 160 },
          },
        }}
      >
        {selectedReview?.status === "PENDING" && (
          <MenuItem
            onClick={() => handleMenuAction("approve")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <CheckCircleIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Approve
          </MenuItem>
        )}
        {selectedReview?.status === "PENDING" && (
          <MenuItem
            onClick={() => handleMenuAction("reject")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <CancelIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Reject
          </MenuItem>
        )}
        {selectedReview?.status === "PENDING" && (
          <MenuItem
            onClick={() => handleMenuAction("delete")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Delete
          </MenuItem>
        )}
        {selectedReview?.status === "APPROVED" && (
          <MenuItem
            onClick={() => handleMenuAction("reject")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <CancelIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Reject
          </MenuItem>
        )}
        {selectedReview?.status === "APPROVED" && (
          <MenuItem
            onClick={() => handleMenuAction("delete")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Delete
          </MenuItem>
        )}
        {selectedReview?.status === "REJECTED" && (
          <MenuItem
            onClick={() => handleMenuAction("approve")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <CheckCircleIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Approve
          </MenuItem>
        )}
        {selectedReview?.status === "REJECTED" && (
          <MenuItem
            onClick={() => handleMenuAction("delete")}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
            Delete
          </MenuItem>
        )}
      </Menu>
      <ReviewDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview as AdminReview | null}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message={`Are you sure you want to delete this review from ${
          reviewToDelete?.author.name || "this user"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ReviewManagement;
