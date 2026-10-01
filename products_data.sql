--
-- PostgreSQL database dump
--

\restrict 7elWLTyjrPkNJlcGq4TXG7mZYfcK4qglA4o6vbizswAf0e6xaNn0Qj5U4o5nQpg

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (4, 'o''doe™ Stainless Steel Baby Bowl with Suction Base, Baby Food Bowl', 'b0d3ps0eu', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/61UFwOVjBOL._SX679_.jpg', 'https://link.amazon/B0d3Ps0EU', 'Amazon', 'Kitchen', NULL, false, false, 0, '2026-10-01 15:48:20.834643+05:30', '2026-10-01 16:09:15.815+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (5, 'Little Boo Long Sleeve Baby Bibs, Waterproof Feeding Smocks for Toddlers 6–36 Months, Full-Sleeve kids Apron,Easy-to-Clean Reusable washable Feeding Bibs, Pack', 'b0hewh5rx', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/61Lp2pLwHDL._SX679_.jpg', 'https://link.amazon/B0hEwH5RX', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.835661+05:30', '2026-10-01 16:09:58.808+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (3, 'Max Care Virgin Coconut Oil (Cold Pressed) 500Ml', 'b0fixkscd', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/61oagbcgAtS._SY879_.jpg', 'https://link.amazon/B0fiXkscd', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.832172+05:30', '2026-10-01 16:10:03.871+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (9, 'Minicult Cotton Unisex Front Open Full Sleeve T-Shirt with snap Buttons and Cute Prints Combo Pack', 'b03l122ma', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/71tHVbOQUgL._SX679_.jpg', 'https://link.amazon/B03L122Ma', 'Amazon', 'Clothes', 3.9, false, true, 0, '2026-10-01 15:48:20.840775+05:30', '2026-10-01 15:56:05.779+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (10, 'Nehomo Print Kids 4-Piece Clothing Set (Yellow & White) | Cap, Jacket, Full Sleeve T-Shirt & Pant Set for Baby Boys & Girls 0-2 Months', 'b03vv7q6b', '12-18 months', NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/41LCVWLBHjL.jpg', 'https://link.amazon/B03vV7Q6B', 'Amazon', 'Clothes', 4.0, false, true, 0, '2026-10-01 15:48:20.841608+05:30', '2026-10-01 15:57:54.64+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (12, 'Neska Moda 6 To 12 Months Baby Boys & Girls Soft Cotton Pre-Walker Lace Booties -SK145', 'b0ckxculr', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/511Dspuu7pL._SY695_.jpg', 'https://link.amazon/B0cKXCULR', 'Amazon', 'Kid shoes', NULL, false, true, 0, '2026-10-01 15:48:20.843302+05:30', '2026-10-01 15:59:25.388+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (14, 'LuvLap Joy Anti Spill Sipper for Kids with Twin Easy-Grip Handles, 270 ml, Sippy Cups with Soft Silicone Straw, Training Cup for Kids,Water Bottle, Non-Toxic &', 'b0acidlq5', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/71QuC3lfWyL._SX679_.jpg', 'https://link.amazon/B0acIDLQ5', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.844974+05:30', '2026-10-01 16:00:30.655+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (15, 'Stainless Steel Kitchen Press with 15 Different Types of Jalies, Murukku Maker/Bhujiya Maker/Noodles Maker/Cookies Maker/Namkeen Maker/Chakali Maker/Sev Maker/F', 'b0hzb4o96', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/41m0KRAEHgL.jpg', 'https://link.amazon/B0hZb4O96', 'Amazon', 'Kitchen', NULL, false, true, 0, '2026-10-01 15:48:20.845656+05:30', '2026-10-01 16:01:10.011+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (16, 'Meditouch Cotton Elastic Slim Belt for Women Abdominal Support after Delivery Maternity Slimming Postpartum Stomach Fit Post Pregnancy C Section Thin Undetectab', 'b0c7cdcyz', '3xl', NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/61hh3X7CwHL._SX522_.jpg', 'https://link.amazon/B0c7CdCyz', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.846295+05:30', '2026-10-01 16:02:17.664+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (18, 'Dobble, Strategy Match Game,Family Card Game, 2-8 Player Game, for 6 Years and Above, Teen, Multicolor', 'b0avuamlt', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/7139ElMlKBL._SY879_.jpg', 'https://link.amazon/B0avUaMlt', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.848496+05:30', '2026-10-01 16:03:24.829+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (19, 'Peek A Boo Infant Full Sleeves Front Open Hooded Jacket, 100% Cotton Loopknit Fabric, Ultra-Soft with Breathable Comfort', 'b07lzeddd', '12-18 Month', NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/51g56AE5zJL._SX679_.jpg', 'https://link.amazon/B07lZedDD', 'Amazon', 'Clothes', NULL, false, true, 0, '2026-10-01 15:48:20.850103+05:30', '2026-10-01 16:04:37.263+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (20, 'Goyal''s Baby Activity Walker - Toddler Learning Toys Push Walker for 6 Months -15 Months (Sea Green)', 'b0b4dirno', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/61Uv8TdOP8L._SX679_.jpg', 'https://link.amazon/B0b4diRNO', 'Amazon', 'Kids Walker', NULL, false, true, 0, '2026-10-01 15:48:20.854356+05:30', '2026-10-01 16:05:36.672+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (1, 'VRITRAZ Comfortable Straw Summer Green Beech Hat and Handbag Perfect Combo for Kids', 'straw-summer-green-beech-hat', NULL, NULL, NULL, 'USD', 'https://m.media-amazon.com/images/I/71JGwEjTo5L._SX679_.jpg', 'https://link.amazon/B0iUywKG9', 'Amazon', 'Kids Hat', NULL, false, true, 1, '2026-10-01 15:37:40.910627+05:30', '2026-10-01 16:07:55.284+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (6, 'R for Rabbit Safari Silicone Bib for Baby Food Feeding BPA Free, Adjustable Straps Waterproof Built-in Food Pocket Mess Free Ideal for Babies 6 to 36 Months', 'b05zid8mk', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/41uPkCET3jL.jpg', 'https://link.amazon/B05ziD8mK', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.837106+05:30', '2026-10-01 16:10:45.819+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (7, 'TS LAVI TAVI Trendy Printed Unisex Cotton T-Shirt & Pyjama Set | Full Sleeve Top & Track Pant | Boys & Girls | Pack of 3 | Newborn & Kids', 'b0bhn7y1o', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/71k1XdWXpGL._SX679_.jpg', 'https://link.amazon/B0bhN7Y1o', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.838969+05:30', '2026-10-01 16:11:36.014+05:30');
INSERT INTO public.products (id, name, slug, description, note, price, currency, image_url, affiliate_url, store, category, rating, featured, published, clicks, created_at, updated_at) VALUES (8, 'KYDA KIDS® Boys 100% Pure Cotton Printed Regular Fit Knee Length Shorts | Soft Breathable Casual Summer Wear | Comfortable Everyday Shorts for Boys (Pack of 5)', 'b0jabzlif', NULL, NULL, NULL, 'INR', 'https://m.media-amazon.com/images/I/71szzEOkjrL._SX679_.jpg', 'https://link.amazon/B0jaBZlif', 'Amazon', NULL, NULL, false, true, 0, '2026-10-01 15:48:20.839872+05:30', '2026-10-01 16:12:11.582+05:30');


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7elWLTyjrPkNJlcGq4TXG7mZYfcK4qglA4o6vbizswAf0e6xaNn0Qj5U4o5nQpg

