/*=============================================================================

    This file is part of FLINT.

    FLINT is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    FLINT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with FLINT; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

=============================================================================*/
/******************************************************************************

    Copyright (C) 2009 William Hart
    Copyright (C) 2010 Sebastian Pancratz

******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <gmp.h>
#include "flint.h"
#include "fmpz.h"
#include "fmpq_poly.h"
#include "fmpq_poly.h"
#include "ulong_extras.h"

int
main(void)
{
    int i, result;
    ulong cflags = UWORD(0);

    FLINT_TEST_INIT(state);

    flint_printf("inv_series_newton....");
    fflush(stdout);   

    /* Check aliasing of a and c */
    for (i = 0; i < 50 * flint_test_multiplier(); i++)
    {
        fmpq_poly_t a, b;
        slong n = n_randint(state, 50) + 1;

        fmpq_poly_init(a);
        fmpq_poly_init(b);
        fmpq_poly_randtest_not_zero(a, state, n_randint(state, 50) + 1, 50);
        fmpz_randtest_not_zero(a->coeffs, state, 50);
        fmpq_poly_canonicalise(a);

        fmpq_poly_inv_series_newton(b, a, n);
        fmpq_poly_inv_series_newton(a, a, n);

        cflags |= fmpq_poly_is_canonical(a) ? 0 : 1;
        cflags |= fmpq_poly_is_canonical(b) ? 0 : 2;
        result = (fmpq_poly_equal(a, b) && !cflags);
        if (!result)
        {
            flint_printf("FAIL:\n");
            fmpq_poly_debug(a), flint_printf("\n\n");
            fmpq_poly_debug(b), flint_printf("\n\n");
            flint_printf("cflags = %wu\n\n", cflags);
            abort();
        }

        fmpq_poly_clear(a);
        fmpq_poly_clear(b);
    }

    /* Check Q^{-1} * Q is congruent 1 mod t^n */
    for (i = 0; i < 100 * flint_test_multiplier(); i++)
    {
        fmpq_poly_t a, b, c, one;
        slong n = n_randint(state, 80) + 1;

        fmpq_poly_init(a);
        fmpq_poly_init(b);
        fmpq_poly_init(c);
        fmpq_poly_init(one);

        fmpq_poly_randtest_not_zero(a, state, n_randint(state, 80) + 1, 80);
        fmpz_randtest_not_zero(a->coeffs, state, 80);
        fmpq_poly_canonicalise(a);
        fmpq_poly_one(one);

        fmpq_poly_inv_series_newton(b, a, n);
        fmpq_poly_mul(c, a, b);
        fmpq_poly_truncate(c, n);

        cflags |= fmpq_poly_is_canonical(b) ? 0 : 1;
        cflags |= fmpq_poly_is_canonical(c) ? 0 : 2;
        result = (fmpq_poly_equal(c, one) && !cflags);
        if (!result)
        {
            flint_printf("FAIL:\n");
            flint_printf("a = "), fmpq_poly_debug(a), flint_printf("\n\n");
            flint_printf("b = "), fmpq_poly_debug(b), flint_printf("\n\n");
            flint_printf("c = "), fmpq_poly_debug(c), flint_printf("\n\n");
            flint_printf("cflags = %wu\n\n", cflags);
            abort();
        }

        fmpq_poly_clear(a);
        fmpq_poly_clear(b);
        fmpq_poly_clear(c);
        fmpq_poly_clear(one);
    }

    FLINT_TEST_CLEANUP(state);
    
    flint_printf("PASS\n");
    return 0;
}