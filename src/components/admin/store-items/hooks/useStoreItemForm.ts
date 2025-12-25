import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { createStoreItem, updateStoreItem } from "../../../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../../../types/marketplace.types";
import {
  type StoreItemFormState,
  createDefaultFormState,
  cloneFormState,
  areStringArraysEqual,
} from "../types";
import { toInputValue, toStartOfDayISO, toEndOfDayISO, inferIsList } from "../utils";

interface UseStoreItemFormProps {
  open: boolean;
  mode: "create" | "edit";
  item?: StoreItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useStoreItemForm = ({
  open,
  mode,
  item,
  onSuccess,
  onClose,
}: UseStoreItemFormProps) => {
  const [formData, setFormData] = useState<StoreItemFormState>(
    createDefaultFormState
  );
  const [displayFile, setDisplayFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [displayPreview, setDisplayPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const initialFormDataRef = useRef<StoreItemFormState>(
    createDefaultFormState()
  );
  const initialExistingImagesRef = useRef<string[]>([]);
  const [productUsageIsList, setProductUsageIsList] = useState(false);
  const [productBenefitsIsList, setProductBenefitsIsList] = useState(false);

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        const storedDiscountType = (item as any).discountType as DiscountType;
        const discountEnabled = Boolean((item as any).discountActive);
        const resolvedDiscountType = discountEnabled
          ? storedDiscountType === "NONE"
            ? ("PERCENTAGE" as DiscountType)
            : storedDiscountType
          : ("NONE" as DiscountType);
        const nextFormState: StoreItemFormState = {
          name: item.name || "",
          description: item.description || "",
          productUsage: (item as any).productUsage || "",
          productBenefits: (item as any).productBenefits || "",
          productIngredients: Array.isArray((item as any).productIngredients)
            ? ([...(item as any).productIngredients] as string[])
            : [],
          price: Number(item.price ?? 0),
          stock: Number(item.stock ?? 0),
          categories: Array.isArray(item.categories)
            ? [...item.categories]
            : [],
          isFeatured: Boolean(item.isFeatured),
          isPublished: Boolean(item.isPublished),
          discountType: resolvedDiscountType,
          discountValue: Number((item as any).discountValue ?? 0),
          discountActive: discountEnabled,
          discountStart: toInputValue((item as any).discountStart),
          discountEnd: toInputValue((item as any).discountEnd),
          preOrderEnabled: Boolean((item as any).preOrderEnabled),
          weight: Number((item as any).weight ?? 0),
          length: Number((item as any).length ?? 0),
          width: Number((item as any).width ?? 0),
          height: Number((item as any).height ?? 0),
        };
        setFormData(nextFormState);
        initialFormDataRef.current = cloneFormState(nextFormState);
        setDisplayPreview(item.display?.url || "");
        const existingImages = item.images || [];
        setImagePreviews(existingImages);
        setExistingImageUrls(existingImages);
        initialExistingImagesRef.current = [...existingImages];
        setProductUsageIsList(inferIsList((item as any).productUsage));
        setProductBenefitsIsList(inferIsList((item as any).productBenefits));
      } else {
        const defaultState = createDefaultFormState();
        setFormData(defaultState);
        initialFormDataRef.current = cloneFormState(defaultState);
        setDisplayPreview("");
        setImagePreviews([]);
        setExistingImageUrls([]);
        initialExistingImagesRef.current = [];
        setProductUsageIsList(false);
        setProductBenefitsIsList(false);
      }
      setDisplayFile(null);
      setImageFiles([]);
      setIngredientInput("");
    }
  }, [open, mode, item]);

  // File handlers
  const handleDisplayFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDisplayFile(file);
      const preview = URL.createObjectURL(file);
      setDisplayPreview(preview);
    }
  };

  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const currentTotal = imagePreviews.length;
    const remainingSlots = Math.max(0, 5 - currentTotal);

    if (files.length > remainingSlots) {
      toast.error(
        `You can only add up to ${remainingSlots} more image(s). Maximum 5 images allowed.`
      );
      return;
    }

    const newFiles = files.slice(0, remainingSlots);
    setImageFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    const isExistingImage = index < existingImageUrls.length;

    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));

    if (isExistingImage) {
      setExistingImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls.splice(index, 1);
        return newUrls;
      });
    } else {
      const fileIndex = index - existingImageUrls.length;
      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(fileIndex, 1);
        return newFiles;
      });
      URL.revokeObjectURL(previewToRemove);
    }
  };

  // Form field handlers
  const updateFormData = (updates: Partial<StoreItemFormState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      productIngredients: [...prev.productIngredients, trimmed],
    }));
    setIngredientInput("");
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productIngredients: prev.productIngredients.filter(
        (_, idx) => idx !== index
      ),
    }));
  };

  const handleDiscountTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextType = event.target.value as DiscountType;
    updateFormData({ discountType: nextType });
  };

  const handleDiscountToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    updateFormData({
      discountActive: isEnabled,
      discountType:
        isEnabled && formData.discountType === "NONE"
          ? ("PERCENTAGE" as DiscountType)
          : isEnabled
          ? formData.discountType
          : ("NONE" as DiscountType),
    });
  };

  const handleDiscountDateChange =
    (field: "discountStart" | "discountEnd") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData({ [field]: event.target.value || "" });
    };

  // Submission
  const extractErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        return error.response.data.message.join(", ");
      }
      return error.response.data.message;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (formData.price < 0) {
      toast.error("Price must be positive");
      return;
    }
    if (formData.stock < 0) {
      toast.error("Stock must be positive");
      return;
    }
    if (mode === "create" && !displayFile) {
      toast.error("Display image is required for new store items");
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      const formKeys = Object.keys(formData) as (keyof StoreItemFormState)[];
      const changedFieldSet =
        mode === "edit"
          ? new Set<keyof StoreItemFormState>(
              formKeys.filter((key) => {
                const initialValue = initialFormDataRef.current?.[key];
                const currentValue = formData[key];
                if (
                  Array.isArray(initialValue) &&
                  Array.isArray(currentValue)
                ) {
                  return !areStringArraysEqual(
                    initialValue as string[],
                    currentValue as string[]
                  );
                }
                return initialValue !== currentValue;
              })
            )
          : new Set<keyof StoreItemFormState>(formKeys);
      const imagesChanged =
        mode === "edit" &&
        !areStringArraysEqual(
          existingImageUrls,
          initialExistingImagesRef.current
        );
      const shouldIncludeField = (field: keyof StoreItemFormState) =>
        mode === "create" || changedFieldSet.has(field);
      if (
        mode === "edit" &&
        changedFieldSet.size === 0 &&
        !imagesChanged &&
        !displayFile &&
        imageFiles.length === 0
      ) {
        toast.error("No changes to update");
        return;
      }

      const appendDateField = (
        key: keyof StoreItemFormState,
        value?: string,
        formatter?: (input: string) => string
      ) => {
        if (!shouldIncludeField(key)) return;
        if (value) {
          submitData.append(key as string, formatter ? formatter(value) : value);
        } else {
          submitData.append(key as string, "");
        }
      };
      const appendField = (
        key: keyof StoreItemFormState,
        value: string | number | boolean
      ) => {
        if (!shouldIncludeField(key)) return;
        submitData.append(key as string, value.toString());
      };
      const appendArrayField = (
        key: keyof StoreItemFormState,
        values: string[]
      ) => {
        if (!shouldIncludeField(key)) return;
        values.forEach((val) => submitData.append(key as string, val));
      };

      appendField("name", formData.name);
      appendField("description", formData.description);
      appendField("productUsage", formData.productUsage);
      appendField("productBenefits", formData.productBenefits);
      if (formData.productIngredients.length > 0) {
        appendArrayField("productIngredients", formData.productIngredients);
      }
      appendField("price", formData.price);
      appendField("stock", formData.stock);
      appendField("isFeatured", formData.isFeatured);
      appendField("isPublished", formData.isPublished);
      appendField("discountType", formData.discountType);
      appendField("discountValue", formData.discountValue);
      appendField("discountActive", formData.discountActive);
      appendDateField("discountStart", formData.discountStart, toStartOfDayISO);
      appendDateField("discountEnd", formData.discountEnd, toEndOfDayISO);
      appendField("preOrderEnabled", formData.preOrderEnabled);
      appendField("weight", formData.weight);
      appendField("length", formData.length);
      appendField("width", formData.width);
      appendField("height", formData.height);

      if (shouldIncludeField("categories") && formData.categories.length > 0) {
        formData.categories.forEach((tag) => {
          submitData.append("categories", tag);
        });
      }

      if (displayFile) {
        submitData.append("display", displayFile);
      }

      imageFiles.forEach((file) => {
        submitData.append("images", file);
      });

      if (mode === "edit") {
        if (existingImageUrls.length === 0) {
          submitData.append("existingImages", "");
        } else {
          existingImageUrls.forEach((url) => {
            submitData.append("existingImages", url);
          });
        }
      }

      if (mode === "create") {
        await createStoreItem(submitData as any);
        toast.success("Store item created successfully");
      } else if (item) {
        await updateStoreItem(item.productId, submitData as any);
        toast.success("Store item updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    displayFile,
    displayPreview,
    imageFiles,
    imagePreviews,
    existingImageUrls,
    submitting,
    ingredientInput,
    setIngredientInput,
    productUsageIsList,
    setProductUsageIsList,
    productBenefitsIsList,
    setProductBenefitsIsList,
    handleDisplayFileChange,
    handleImageFilesChange,
    handleRemoveImage,
    handleAddIngredient,
    handleRemoveIngredient,
    handleDiscountTypeChange,
    handleDiscountToggle,
    handleDiscountDateChange,
    handleSubmit,
  };
};

