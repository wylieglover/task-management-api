import { prisma } from "../lib/prisma.js"
import { notFound } from "../errors/httpErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js";

export const createItem = asyncHandler(async(_req, res, _next) => {
  const { description } = res.locals.body;
  const userId = res.locals.userId;

  const item = await prisma.item.create({
    data: {
      description,
      userId
    }
  });

  return res.status(201).json({ item });
});

export const getItems = asyncHandler(async(_req, res, _next) => {
  const { completed } = (res.locals.query ?? {});
  const userId = res.locals.userId;

  const items = await prisma.item.findMany({
    where: {
      userId,
      ...(completed !== undefined ? 
        { completed } : {}
      )
    }
  });

  return res.status(200).json({ items });
});

export const getItemById = asyncHandler(async(_req, res, _next) => {
  const { id } = res.locals.params;
  const userId = res.locals.userId;

  const item = await prisma.item.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!item) {
    throw notFound(`Item ${id} not found`);
  }

  return res.status(200).json({ item });
});

export const updateItembyId = asyncHandler(async(_req, res, _next) => {
  const { id } = res.locals.params;
  const userId = res.locals.userId;
  const { description, completed } = res.locals.body;

  const existing = await prisma.item.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    throw notFound(`Item ${id} not found`);
  }

  const item = await prisma.item.update({
    where: { id: existing.id },
    data: {
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { 
        completed,
        completedAt: completed ? new Date() : null
      })
    },
  });
  
  return res.status(200).json({ item });
});

export const deleteItembyId = asyncHandler(async(_req, res, _next) => {
  const { id } = res.locals.params;
  const userId = res.locals.userId;

  const existing = await prisma.item.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    throw notFound(`Item ${id} not found`);
  }

  await prisma.item.delete({
    where: {
      id: existing.id
    }
  });

  return res.status(200).json({ message: `Item ${id} was deleted` });
});
