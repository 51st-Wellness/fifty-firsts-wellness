import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import type { AdminOrderDetail } from "../../../api/user.api";
import { currency } from "./utils";

interface OrderItemsListProps {
  order: AdminOrderDetail;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ order }) => {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: '"League Spartan", sans-serif',
          mb: 1.5,
          fontWeight: 600,
        }}
        color="text.secondary"
      >
        Order Items ({order.orderItems?.length || 0})
      </Typography>
      <Stack spacing={1.5}>
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((item) => {
            const storeItem = item.product?.storeItem;
            const productName = storeItem?.name || "Unknown Product";
            const productImage =
              storeItem?.display?.url || storeItem?.images?.[0] || null;
            const productDescription = storeItem?.description;
            const itemTotal = item.quantity * item.price;

            return (
              <Card
                key={`${order.id}-${item.id}`}
                variant="outlined"
                sx={{
                  "&:hover": {
                    boxShadow: 1,
                  },
                }}
              >
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: { xs: "80px", sm: "100px" },
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "1",
                          bgcolor: "grey.100",
                          borderRadius: 1.5,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {productImage ? (
                          storeItem?.display?.type === "video" ? (
                            <video
                              src={productImage}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              controls={false}
                            />
                          ) : (
                            <img
                              src={productImage}
                              alt={productName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )
                        ) : (
                          <ImageIcon sx={{ fontSize: 32, color: "grey.400" }} />
                        )}
                      </Box>
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack spacing={0.5}>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{
                              fontFamily: '"League Spartan", sans-serif',
                            }}
                          >
                            {productName}
                          </Typography>
                          {productDescription && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.25 }}
                            >
                              {productDescription.length > 100
                                ? `${productDescription.substring(0, 100)}...`
                                : productDescription}
                            </Typography>
                          )}
                        </Box>

                        {/* Quantity and Price Info */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Qty: <strong>{item.quantity}</strong>
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="primary"
                          >
                            {currency(itemTotal)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No items found
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default OrderItemsList;

